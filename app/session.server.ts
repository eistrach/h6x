import { User } from "@prisma/client";
import { createCookieSessionStorage } from "@remix-run/node";
import { Authenticator } from "remix-auth";
import { DiscordStrategy } from "remix-auth-socials";
import { z } from "zod";

import { createOrUpdateUser, getUserById } from "~/domain/user.server";
import { env } from "./environment.server";

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

const schema = z.object({
  username: z.string().min(1),
  email: z.string().min(1),
  discriminator: z.string().min(1),
  id: z.string().min(1),
  avatar: z.string().optional(),
});

authenticator.use(
  new DiscordStrategy(
    {
      clientID: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      callbackURL: env.DISCORD_CALLBACK_URL,
    },
    async ({ profile }) => {
      const result = await schema.safeParseAsync(profile.__json);

      console.log(result);

      if (!result.success) {
        throw new Error(
          `Invalid profile: ${JSON.stringify(result.error.issues)}`
        );
      }

      const avatarUrl = !!result.data.avatar
        ? `https://cdn.discordapp.com/avatars/${result.data.id}/${result.data.avatar}.png`
        : null;

      const user = await createOrUpdateUser({
        email: result.data.email,
        username: `${result.data.username}#${result.data.discriminator}`,
        avatarUrl,
        displayName: result.data.username,
      });

      return user.id;
    }
  )
);

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
