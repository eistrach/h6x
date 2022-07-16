import { useLocation, useMatches } from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import styles from "./styles/tailwind.css";
import fontStyles from "./styles/rubik.css";
import customStyles from "./styles/custom.css";
import { LoaderArgs } from "./core/utils";
import { getUser } from "./domain/auth/session.server";
import clsx from "clsx";
import AppUrlListener from "./ui/components/base/AppUrlListener";
import React from "react";
import { MetronomeLinks } from "@metronome-sh/react";

let isMount = true;

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: fontStyles },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "stylesheet", href: customStyles },
];
export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "h6x",
  viewport: "width=device-width,initial-scale=1, viewport-fit=cover",
  "apple-mobile-web-app-status-bar-style": "black-translucent",
});
export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);
  return { user };
};
export default function App() {
  let location = useLocation();
  let matches = useMatches();
  React.useEffect(() => {
    let mounted = isMount;
    isMount = false;
    if ("serviceWorker" in navigator) {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller?.postMessage({
          type: "REMIX_NAVIGATION",
          isMount: mounted,
          location,
          matches,
          manifest: window.__remixManifest,
        });
      } else {
        let listener = async () => {
          await navigator.serviceWorker.ready;
          navigator.serviceWorker.controller?.postMessage({
            type: "REMIX_NAVIGATION",
            isMount: mounted,
            location,
            matches,
            manifest: window.__remixManifest,
          });
        };
        navigator.serviceWorker.addEventListener("controllerchange", listener);
        return () => {
          navigator.serviceWorker.removeEventListener(
            "controllerchange",
            listener
          );
        };
      }
    }
  }, [location]);

  return (
    <html lang="en">
      <AppUrlListener />
      <head>
        <Meta /> <link rel="manifest" href="/resources/manifest.webmanifest" />
        <Links />
        <MetronomeLinks />
      </head>
      <body className="h-full bg-gray-100 overscroll-none p-safe">
        <main className={clsx("overscroll-auto h-full", {})}>
          <Outlet />
        </main>
        <ScrollRestoration /> <Scripts /> <LiveReload />
      </body>
    </html>
  );
}
