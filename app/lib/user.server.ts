import { User } from "@prisma/client";
import { prisma } from "~/lib/db.server";

export type { User } from "@prisma/client";

export type DiscordProfile = {
  id: string;
  username: string;
  discriminator: string;
  email?: string;
  avatarUrl: string | null;
};

export const getUserForId = async (id: string) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const getUserByDiscordId = async (discordId: string) => {
  return prisma.user.findUnique({
    where: {
      discordId,
    },
  });
};

export const createUser = async (nickname: string) => {
  return prisma.user.create({
    data: {
      nickname,
    },
  });
};

export const getOrCreateDiscordUser = async (profile: DiscordProfile) => {
  const user = await getUserByDiscordId(profile.id);
  if (user) return user;
  return prisma.user.create({
    data: {
      nickname: profile.username,
      avatarUrl: profile.avatarUrl,
    },
  });
};

export const linkUserToDiscord = async (
  user: User,
  profile: DiscordProfile
) => {
  const existingUser = await getUserByDiscordId(profile.id);

  if (existingUser) {
    // todo: instead of deleting we should merge active games into existing user
    if (!user.username) await prisma.user.delete({ where: { id: user.id } });
    return existingUser;
  }
  return prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      username: user.username || `${profile.username}#${profile.discriminator}`,
      discordId: profile.id,
    },
  });
};
