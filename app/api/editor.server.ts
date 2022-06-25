import { redirect } from "@remix-run/node";
import { z } from "zod";
import { assertUser, createAction, createLoader } from "~/domain/index.server";
import { createMap, getMapsForUser } from "~/domain/map.server";

const Schema = z.object({ name: z.string().min(1) });
export const editorAction = createAction(Schema, async ({ name }, ctx) => {
  assertUser(ctx);
  const map = await createMap(name, ctx.user.id);
  return redirect(`/editor/${map.id}`);
});

export const editorLoader = createLoader(async (ctx) => {
  assertUser(ctx);
  return getMapsForUser(ctx.user.id);
});

export type EditorLoaderData = Awaited<ReturnType<typeof editorLoader>>;
