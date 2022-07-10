import { CellState, PlayerState, PlayingState } from "../../core/actions/types";
import { GamePhase, Player, Prisma, User } from "@prisma/client";
import { getMapForId } from "../map.server";
import { prisma } from "~/db.server";

import { PreparationState } from "~/core/actions/types";
import {
  getCurrentPlayer,
  initializeCells,
  initializePlayers,
  initializePlayingState,
  initializePreparationState,
  updatePlayingState,
} from "./utils";
import { UnpackArray, UnpackData } from "~/core/utils";

export type Game = UnpackArray<UnpackData<typeof getGamesForUser>>;
export async function getGamesForUser(userId: string) {
  const games = await prisma.player
    .findMany({
      where: {
        userId,
      },
      include: {
        game: {
          include: {
            creator: true,
            map: {
              include: {
                cells: true,
              },
            },
            players: {
              include: {
                user: true,
              },
              orderBy: {
                id: "asc",
              },
            },
          },
        },
      },
    })
    .then((players) =>
      players
        .map((player) => player.game)
        .filter(
          (game, index, self) =>
            index === self.findIndex((g) => g.id === game.id)
        )
    );

  return games.map((g) => {
    const lastState = g.states[g.states.length - 1] as PlayingState | null;
    return {
      ...g,
      isFinished: lastState?.playerIdSequence.length === 1,
      gameState: lastState,
      players: g.players.map((p) => ({
        ...p,
        preparationState: p.preparationState as PreparationState | null,
      })),
    };
  });
}

export async function getGame(id: string) {
  const game = await prisma.game.findUnique({
    where: {
      id,
    },
    include: {
      creator: true,
      map: {
        include: {
          cells: true,
        },
      },
      players: {
        include: {
          user: true,
        },
        orderBy: {
          id: "asc",
        },
      },
    },
  });

  if (!game) {
    return null;
  }

  const lastState = game.states[game.states.length - 1] as PlayingState | null;
  return {
    ...game,
    isFinished: lastState?.playerIdSequence.length === 1,
    gameState: lastState,
    players: game.players.map((p) => ({
      ...p,
      preparationState: p.preparationState as PreparationState | null,
    })),
  };
}

export async function requireGame(id: string, phases?: GamePhase[]) {
  const game = await getGame(id);

  if (!game) {
    throw new Error("Game not found");
  }

  if (phases && !phases.includes(game.phase)) {
    throw new Error("Game is not in the required phase");
  }

  return game;
}

export async function requireGameAndPlayer(
  id: string,
  playerId: string,
  phases?: GamePhase[]
) {
  const game = await requireGame(id, phases);

  const player = game.players.find((player) => player.id === playerId);

  if (!player) {
    throw new Error("Player not found");
  }

  return { game, player };
}

export function requireGameState(
  game: Game,
  player: Player
): PlayingState | PreparationState {
  const state = player.preparationState || game.gameState;

  if (!state) {
    throw new Error("State is missing");
  }

  if (game.phase === "PREPARATION") {
    return state as PreparationState;
  }

  return state as PlayingState;
}

export function requirePlayingState(game: Game) {
  const state = game.gameState;

  if (!state) {
    throw new Error("State is missing");
  }

  return state as PlayingState;
}

export async function updateGameState(game: Game, state: PlayingState) {
  return prisma.game.update({
    where: { id: game.id },
    data: {
      states: [...game.states, state],
    },
  });
}

export async function createGame(creatorId: string, mapId: string) {
  const map = await getMapForId(mapId);

  if (!map) {
    throw new Error("Map not found");
  }

  return await prisma.game.create({
    data: {
      creatorId,
      mapId,
      players: {
        create: [
          {
            userId: creatorId,
          },
        ],
      },
    },
  });
}

export async function joinGame(id: string, userId: string) {
  const game = await requireGame(id);

  if (game.phase !== "LOBBY") {
    throw new Error("Game is already started");
  }

  if (game?.players.length >= 6) {
    throw new Error("Game is already full");
  }

  return await prisma.game.update({
    where: { id },
    data: {
      players: {
        create: [
          {
            userId,
          },
        ],
      },
    },
  });
}

export async function startPreparation(id: string, userId: string) {
  const game = await requireGame(id, ["LOBBY"]);

  if (game.players.length < 2) {
    throw new Error("Game needs at least 2 players");
  }

  if (game.creatorId !== userId) {
    throw new Error("Only the game creator can start the game");
  }

  const map = await getMapForId(game.mapId);
  if (!map) {
    throw new Error("Map not found");
  }

  const playerStates = initializePlayers(game);
  const cells = initializeCells(playerStates, map.cells);

  const players = game.players.map((player) => ({
    ...player,
    preparationState: initializePreparationState(
      player.id,
      playerStates,
      cells
    ),
  }));

  return await prisma.$transaction(async (prisma) => {
    await Promise.all(
      players.map(({ user, ...p }) =>
        prisma.player.update({
          where: { id: p.id },
          data: p,
        })
      )
    );

    return await prisma.game.update({
      where: { id },
      data: {
        phase: "PREPARATION",
        states: [...game.states, initializePlayingState(playerStates)],
      },
    });
  });
}

export async function startGame(id: string) {
  const game = await requireGame(id, ["PREPARATION"]);

  const preparationStates = game.players.map(
    (player) => player.preparationState as PreparationState
  );

  const initialGameState = updatePlayingState(
    preparationStates,
    game.gameState as PlayingState
  );

  return await prisma.$transaction(async (prisma) => {
    await Promise.all(
      game.players.map((p) =>
        prisma.player.update({
          where: { id: p.id },
          data: {
            preparationState: Prisma.JsonNull,
          },
        })
      )
    );

    return await prisma.game.update({
      where: { id },
      data: {
        phase: "PLAYING",
        states: [initialGameState],
      },
    });
  });
}

export const isPlayerAlreadyInGame = async (id: string, playerId: string) => {
  const game = await requireGame(id);
  return game.players.some((p) => p.id === playerId);
};

export const getGameWithState = async (id: string, user: User) => {
  const game = await requireGame(id);

  if (game.phase === "LOBBY") {
    return null;
  }

  if (game.phase === "PREPARATION") {
    const preparationStates = game.players
      .filter((p) => p.userId === user.id)
      .map((p) => p.preparationState!);
    const preparationState =
      preparationStates.find((p) => !p.done) || preparationStates[0];

    return {
      game: game,
      state: preparationState,
      canTakeAction: !preparationState?.done,
    };
  }

  const currentPlayer = getCurrentPlayer(game.gameState!);
  return {
    game,
    state: game.gameState as PlayingState,
    canTakeAction: currentPlayer?.userId === user.id,
  };
};

export type GameWithState = Exclude<UnpackData<typeof getGameWithState>, null>;
