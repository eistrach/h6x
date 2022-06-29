import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import styles from "./tailwind.css";
import fontStyles from "./rubik.css";
import { LogoIcon } from "./components/icons/LogoIcon";
import { LoaderArgs, useOptionalUser } from "./utils";
import { getUser } from "./session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: fontStyles },
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
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-yellow-50">
        {user && (
          <div className="h-16 bg-yellow-200 shadow-sm px-4 flex justify-between items-center">
            <div className="  flex gap-1 justify-start items-center">
              <LogoIcon className="w-10 h-10" />
              <span className="font-extrabold text-2xl">h6x</span>
            </div>
            <div className="flex items-center gap-2 ">
              <div className="flex flex-col items-end">
                <span className="font-bold  text-stone-900">
                  {user.displayName}
                </span>
                <span className="text-xs text-yellow-700">
                  #{user.username.split("#")[1]}
                </span>
              </div>
              <img
                className="w-10 h-10 border-2 border-black shadow-md rounded-full"
                src={user.avatarUrl || ""}
              ></img>
            </div>
          </div>
        )}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
