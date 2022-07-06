import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Link,
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
import { LogoIcon } from "./components/icons/LogoIcon";
import { LoaderArgs, useOptionalUser } from "./utils";
import { getUser } from "./auth/session.server";
import clsx from "clsx";
import ProfileMenu from "./components/base/ProfileMenu";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: fontStyles },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "stylesheet", href: customStyles },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "h6x",
  viewport: "width=device-width,initial-scale=1",
});

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);
  return { user };
};

export default function App() {
  const user = useOptionalUser();

  return (
    <html lang="en" className="">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-gray-100 overscroll-none">
        <main className={clsx("overscroll-auto h-full", {})}>
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
