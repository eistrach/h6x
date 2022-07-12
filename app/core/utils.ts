import seedrandom from "seedrandom";
import { useMatches } from "@remix-run/react";
import { useEffect, useMemo } from "react";
import type { DataFunctionArgs } from "@remix-run/node";

import type { User } from "~/domain/user.server";
import { useDataRefresh } from "remix-utils";
import { Point } from "./math";
import { Cell } from "../map.server";
import { CellState } from "./actions/types";

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user: any): user is User & { isAdmin: boolean } {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): (User & { isAdmin: boolean }) | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User & { isAdmin: boolean } {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export async function copyTextToClipboard(text: string) {
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand("copy", true, text);
  }
}

export function randomIntFromInterval(
  rng: seedrandom.PRNG,
  min: number,
  max: number
) {
  // min and max included
  return Math.floor(rng() * (max - min + 1) + min);
}

export function useDataRefreshOnInterval(
  intervalNumber: number,
  stop: boolean
) {
  let { refresh } = useDataRefresh();
  useEffect(() => {
    let interval = setInterval(() => {
      if (!stop) refresh();
    }, intervalNumber);
    return () => clearInterval(interval);
  }, [refresh, stop]);
}

export const toId = (p: Point | Cell | CellState) => {
  if ("x" in p && "y" in p) {
    return `${p.x}-${p.y}`;
  }
  return `${p.position.x}-${p.position.y}`;
};

export type UnpackData<F extends (...args: any) => any> = Exclude<
  Awaited<ReturnType<F>>,
  Response
>;

export type UnpackArray<T> = T extends (infer U)[] ? U : T;

export type LoaderArgs = DataFunctionArgs;
export type ActionArgs = DataFunctionArgs;
