import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(1),
  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_CLIENT_SECRET: z.string().min(1),
  DISCORD_CALLBACK_URL: z.string().min(1),
  ADMIN_EMAILS: z.string().min(1).optional(),
  NODE_ENV: z.string().min(1),
});

export const env = envSchema.parse(process.env);
