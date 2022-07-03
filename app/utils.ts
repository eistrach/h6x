import seedrandom from "seedrandom";
import { useMatches } from "@remix-run/react";
import { useMemo } from "react";
import type { DataFunctionArgs } from "@remix-run/node";

import type { User } from "~/domain/user.server";

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

function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
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
  console.log(text);
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

export type UnpackData<F extends (...args: any) => any> = Exclude<
  Awaited<ReturnType<F>>,
  Response
>;

export type UnpackArray<T> = T extends (infer U)[] ? U : T;

export type LoaderArgs = DataFunctionArgs;
export type ActionArgs = DataFunctionArgs;
