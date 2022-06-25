import { DataFunctionArgs, json, redirect } from "@remix-run/node";
import { Params } from "@remix-run/react";
import {
  DomainFunction,
  inputFromForm,
  makeDomainFunction,
} from "remix-domains";
import { z } from "zod";

import { getUser } from "~/session.server";
import { User } from "./user.server";

async function createContext(args: DataFunctionArgs) {
  return {
    ...args,
    user: await getUser(args.request),
  };
}

export function assertUser(
  ctx: Context
): asserts ctx is Context & { user: User } {
  if (!ctx.user) {
    throw new Error("User is not logged in");
  }
}

export function param(ctx: Context, name: string): string {
  const param = ctx.params[name];
  if (!param) {
    throw new Error(`Missing parameter ${name}`);
  }
  return param;
}

export type Context = Awaited<ReturnType<typeof createContext>>;

export function createAction<Schema extends z.ZodTypeAny, Output>(
  schema: Schema,
  handler: (data: z.infer<Schema>, ctx: Context) => Promise<Output>
) {
  return async (args: DataFunctionArgs) => {
    const ctx = await createContext(args);
    const domainFunction = makeDomainFunction(schema)((data) => {
      return handler(data, ctx);
    });

    const input = await inputFromForm(args.request);
    const result = await domainFunction(input);

    if (!result.success) {
      console.error("Error during mutation", result);
      return result;
    }

    return result.data;
  };
}

export function createLoader<Output>(
  handler: (ctx: Context) => Promise<Output>
) {
  return async (args: DataFunctionArgs) => {
    const ctx = await createContext(args);
    const domainFunction = makeDomainFunction(z.null())((data) => {
      return handler(ctx);
    });

    //const input = await inputFromForm(args.request);
    const result = await domainFunction(null);

    if (!result.success) {
      console.debug(result);
      throw new Response("Not found", { status: 404 });
    }

    return result.data;
  };
}
