import { DiscordStrategy, GoogleStrategy } from "remix-auth-socials";
import { z } from "zod";
import { createOrUpdateUser } from "~/domain/user.server";
import { env } from "../../environment.server";

const schema = z.object({
  sub: z.string().min(1),
  email: z.string().min(1).optional().nullable(),
  given_name: z.string().min(1),
  family_name: z.string().min(1),
  picture: z.string().min(1).optional().nullable(),
});

export const googleStrategy = new GoogleStrategy(
  {
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: env.GOOGLE_CALLBACK_URL,
  },
  async ({ profile }) => {
    console.debug(profile);

    const result = await schema.safeParseAsync(profile._json);

    console.debug(result);

    if (!result.success) {
      console.error(`Invalid profile: ${JSON.stringify(result.error.issues)}`);
      throw new Error(
        `Invalid profile: ${JSON.stringify(result.error.issues)}`
      );
    }

    const user = await createOrUpdateUser({
      email: result.data.email || "",
      username: `${result.data.given_name}#${result.data.family_name}`,
      avatarUrl: result.data.picture || null,
      displayName: result.data.given_name,
    });

    return user.id;
  }
);
