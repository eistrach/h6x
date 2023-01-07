import { User } from "@prisma/client";
import { prisma } from "~/lib/db.server";
import { ExtractReturnType } from "~/lib/type-helpers";

export type PlayingState = ExtractReturnType<typeof getPlayingState>;

export const getPlayingState = async (gameId: string, user: User) => {
  const game = await prisma.game.findFirst({
    where: { id: gameId, phase: "Playing" },
    include: { members: { include: { user: true } },  },
  });

  game.

  return game;
};
