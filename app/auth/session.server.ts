import { discortStrategy } from "./discord.server";
import { User } from "@prisma/client";
import { createCookieSessionStorage } from "@remix-run/node";
import { Authenticator } from "remix-auth";

import { getUserById } from "~/domain/user.server";
import { env } from "../environment.server";
import { googleStrategy } from "./google.server";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secrets: [env.SESSION_SECRET],
    secure: env.NODE_ENV === "production",
  },
});

export const authenticator = new Authenticator<string>(sessionStorage);
authenticator.use(discortStrategy).use(googleStrategy);

export async function requireUser(request: Request) {
  const userId = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const user = await getUserById(userId);

  if (!user) {
    await authenticator.logout(request, { redirectTo: "/login" });
  }

  return user as User;
}

export async function getUser(request: Request) {
  const userId = await authenticator.isAuthenticated(request);

  if (!userId) {
    return null;
  }

  const user = await getUserById(userId);

  return user;
}
