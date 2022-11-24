import { DiscordStrategy } from "remix-auth-socials";
import { z } from "zod";
import { getOrCreateDiscordUser, linkUserToDiscord } from "~/lib/user.server";
import { env } from "../../environment.server";

const schema = z.object({
  username: z.string().min(1),
  email: z.string().min(1).optional().nullable(),
  discriminator: z.string().min(1),
  id: z.string().min(1),
  avatar: z.string().optional().nullable(),
});

export const discortStrategy = new DiscordStrategy(
  {
    clientID: env.DISCORD_CLIENT_ID,
    clientSecret: env.DISCORD_CLIENT_SECRET,
    callbackURL: env.DISCORD_CALLBACK_URL,
  },
  async ({ profile }) => {
    const result = await schema.safeParseAsync(profile.__json);

    if (!result.success) {
      throw new Error(
        `Invalid profile: ${JSON.stringify(result.error.issues)}`
      );
    }

    const avatarUrl = !!result.data.avatar
      ? `https://cdn.discordapp.com/avatars/${result.data.id}/${result.data.avatar}.png`
      : null;

    const customProfile = {
      id: result.data.id,
      email: result.data.email || "",
      username: result.data.username,
      discriminator: result.data.discriminator,
      avatarUrl,
    };

    let user = await getOrCreateDiscordUser(customProfile);

    if (!user.discordId) {
      user = await linkUserToDiscord(user, customProfile);
    }

    return user.id;
  }
);
