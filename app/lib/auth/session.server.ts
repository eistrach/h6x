import { redirectCookie } from "../cookies.server";
import { discortStrategy } from "./discord.server";
import { User } from "@prisma/client";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { Authenticator } from "remix-auth";

import { env } from "../../environment.server";
import { getUserForId } from "~/lib/user.server";

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
authenticator.use(discortStrategy);

export const isAdmin = (user: User) => {
  return (env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim())
    .includes(user.nickname);
};

export async function requireUser(request: Request) {
  const userId = await authenticator.isAuthenticated(request);

  if (!userId) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await redirectCookie.serialize(request.url),
      },
    });
  }

  const user = await getUserForId(userId);

  if (!user) {
    await authenticator.logout(request, { redirectTo: "/login" });
  }

  return { ...user!, isAdmin: isAdmin(user!) };
}

export async function requireAdmin(request: Request) {
  const user = await requireUser(request);

  if (!user.isAdmin) {
    throw new Error("Not authorized");
  }

  return user;
}

export async function getUser(request: Request) {
  const userId = await authenticator.isAuthenticated(request);

  if (!userId) {
    return null;
  }

  const user = await getUserForId(userId);

  if (!user) {
    return null;
  }

  return { ...user, isAdmin: isAdmin(user) };
}
