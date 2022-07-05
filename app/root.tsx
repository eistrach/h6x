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
  console.log(user);
  return (
    <html lang="en" className="">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-gray-100 overscroll-none">
        {user && (
          <div className="fixed z-10 left-0 right-0 top-0 rounded-b-2xl backdrop-blur-sm h-16 bg-gray-200/50 px-4 flex justify-between items-center">
            <Link to="/" className="flex gap-1 justify-start items-center">
              <LogoIcon className="w-10 h-10" />
              <span className="font-extrabold text-2xl">h6x</span>
            </Link>
            <ProfileMenu />
          </div>
        )}
        <main
          className={clsx("overscroll-auto h-full", {
            "mt-16": !!user,
          })}
        >
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
