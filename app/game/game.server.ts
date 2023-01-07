import type { User } from "@prisma/client";
import { prisma } from "~/lib/db.server";
import { ExtractReturnType } from "~/lib/type-helpers";
import { getPlayingState, PlayingState } from "./playing.server";
import { getPreparationState, PreparationState } from "./preparing.server";

export type Game = ExtractReturnType<typeof getGamesForUser>;

export const getGameById = async (id: string) => {
  return await prisma.game.findUnique({
    where: { id },
    include: {
      members: { include: { user: true } },
      map: { include: { tiles: true } },
    },
  });
};

export const getGamesForUser = async (user: User) => {
  return await prisma.game.findMany({
    where: {
      members: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      members: true,
    },
    orderBy: { updatedAt: "desc" },
  });
};

export const createNewGame = async (
  user: User,
  { mapId, minutesUntilTimeout }: { mapId: string; minutesUntilTimeout: number }
) => {
  return await prisma.game.create({
    data: {
      creatorId: user.id,
      minutesUntilTimeout,
      mapId,
      members: {
        create: {
          userId: user.id,
        },
      },
    },
    include: {
      members: { include: { user: true } },
    },
  });
};

export const joinGame = async (gameId: string, user: User) => {
  const lobby = await prisma.game.findUnique({
    where: { id: gameId },
    include: { members: true },
  });
  if (!lobby) throw Error(`Lobby '${gameId}' not found`);
  if (lobby.phase !== "Waiting")
    throw Error(`Game '${gameId}' was already started`);
  if (lobby.members.length >= 6) throw Error(`Game '${gameId}' is full`);

  if (lobby.members.find((m) => m.userId === user.id)) return lobby;

  return await prisma.game.update({
    where: {
      id: gameId,
    },
    data: {
      updatedAt: new Date(),
      members: { create: { userId: user.id } },
    },
    include: {
      members: { include: { user: true } },
    },
  });
};

export type GameState =
  | PreparationState
  | PlayingState
  | { phase: "Finished"; canTakeAction: false }
  | { phase: "Waiting"; canTakeAction: false };

export const getGameState = async (
  gameId: string,
  user: User
): Promise<GameState> => {
  const { phase } = (await prisma.game.findUnique({
    where: { id: gameId },
    select: { phase: true },
  })) || { phase: null };
  switch (phase) {
    case "Waiting":
      return {
        phase: "Waiting",
        canTakeAction: false,
      };
    case "Preparing":
      return await getPreparationState(gameId, user);
    case "Playing":
      return await getPlayingState(gameId, user);
    case "Finished":
      return {
        phase: "Finished",
        canTakeAction: false,
      };
    default:
      throw Error("Unknown phase");
  }
};
