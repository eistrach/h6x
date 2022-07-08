import { createCookie } from "@remix-run/node";
import { env } from "./environment.server";

export const redirectCookie = createCookie("__redirect", {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 30,
  path: "/",
  sameSite: "lax",
  secrets: [env.SESSION_SECRET],
  secure: env.NODE_ENV === "production",
});
