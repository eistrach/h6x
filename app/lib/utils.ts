import seedrandom from "seedrandom";
import { useEffect, useMemo } from "react";
import { useDataRefresh } from "remix-utils";
import { useMatches } from "@remix-run/react";

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
