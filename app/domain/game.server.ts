import { PrismaClient } from "@prisma/client";
import {
  buyUnitDuringSetup,
  endSetupTurn,
  initializeCells,
  initializeGame,
  initializePlayers,
  initializeSetup,
  upgradeCellDuringSetup,
} from "./../lib/setup-actions";
import { getMapForId } from "./map.server";
import { prisma } from "~/db.server";
import { Point } from "~/lib/grid";
import { SetupState } from "~/lib/game";

export async function getGamesForUser(userId: string) {
  return prisma.player
    .findMany({
      where: {
        userId,
      },
      include: {
        game: {
          include: {
            map: {
              include: {
                cells: true,
              },
            },
            players: {
              include: {
                user: true,
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
}

export async function getGame(id: string) {
  return prisma.game.findUnique({
    where: {
      id,
    },
    include: {
      map: {
        include: {
          cells: true,
        },
      },
      players: true,
    },
  });
}

export async function requireGame(id: string) {
  const game = await getGame(id);

  if (!game) {
    throw new Error("Game not found");
  }
  return game;
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

  // if (game.players.some((player) => player.userId === userId)) {
  //   throw new Error("User is already in the game");
  // }

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

export async function startSetupPhase(id: string) {
  const game = await requireGame(id);
  if (game.players.length < 2) {
    throw new Error("Game needs at least 2 players");
  }

  if (game.phase !== "LOBBY") {
    throw new Error("Game is already started");
  }

  const map = await getMapForId(game.mapId);

  if (!map) {
    throw new Error("Map not found");
  }

  const playerStates = initializePlayers(game.players);
  const cells = initializeCells(playerStates, map.cells);

  const setupStates = playerStates.map((player) =>
    initializeSetup(player.id, playerStates, cells)
  );

  const players = game.players.map((player) => ({
    ...player,
    setupState: setupStates.find(
      (state) => state.currentPlayerId === player.id
    )!,
  }));

  return await prisma.$transaction(async (prisma) => {
    await Promise.all(
      players.map((p) =>
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
      },
    });
  });
}

export async function buyUnit(
  id: string,
  playerId: string,
  position: Point,
  unitId: string
) {
  const game = await requireGame(id);
  if (game.phase !== "PREPARATION") {
    throw new Error("Game is already started");
  }

  const player = game.players.find((player) => player.id === playerId);

  if (!player) {
    throw new Error("Player not found");
  }

  const setupState = player.setupState as SetupState | null;
  if (!setupState) {
    throw new Error("Is not preparation phase");
  }

  const newState = buyUnitDuringSetup(setupState, {
    senderId: playerId,
    position,
    unitId,
  });

  return await prisma.player.update({
    where: { id: player.id },
    data: {
      setupState: newState,
    },
  });
}

export async function upgradeUnit(
  id: string,
  playerId: string,
  position: Point
) {
  const game = await requireGame(id);
  if (game.phase !== "PREPARATION") {
    throw new Error("Game is already started");
  }

  const player = game.players.find((player) => player.id === playerId);

  if (!player) {
    throw new Error("Player not found");
  }

  const setupState = player.setupState as SetupState | null;
  if (!setupState) {
    throw new Error("Is not preparation phase");
  }

  const newState = upgradeCellDuringSetup(setupState, {
    senderId: playerId,
    position,
  });

  return await prisma.player.update({
    where: { id: player.id },
    data: {
      setupState: newState,
    },
  });
}

export async function endTurn(id: string, playerId: string) {
  const game = await requireGame(id);
  if (game.phase !== "PREPARATION") {
    throw new Error("Game is already started");
  }

  const player = game.players.find((player) => player.id === playerId);

  if (!player) {
    throw new Error("Player not found");
  }

  const setupState = player.setupState as SetupState | null;
  if (!setupState) {
    throw new Error("Is not preparation phase");
  }

  const newState = endSetupTurn(setupState, {
    senderId: playerId,
  });

  const setupDone =
    newState.done &&
    game.players
      .filter((p) => p.id !== playerId)
      .map((p) => p.setupState as SetupState)
      .every((state) => state.done);

  if (setupDone) {
    return await startGame(id);
  }

  return await prisma.player.update({
    where: { id: player.id },
    data: {
      setupState: newState,
    },
  });
}
export async function startGame(id: string) {
  const game = await requireGame(id);
  if (game.phase !== "PREPARATION") {
    throw new Error("Game can not be started");
  }

  const playerStates = game.players.map(
    (player) => player.setupState as SetupState
  );

  const initialGameState = initializeGame(playerStates);

  return await prisma.$transaction(async (prisma) => {
    await Promise.all(
      game.players.map((p) =>
        prisma.player.update({
          where: { id: p.id },
          data: {
            setupState: undefined,
          },
        })
      )
    );

    return await prisma.game.update({
      where: { id },
      data: {
        phase: "PLAYING",
        gameState: initialGameState,
      },
    });
  });
}
