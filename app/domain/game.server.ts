import { UnitId } from "../config/units";
import { attackCell, endTurn, upgradeCell } from "./logic/game-actions";
import { CellState, PlayerState, PlayingState } from "./../domain/logic/game";
import { GamePhase } from "@prisma/client";

import { v4 as uuid } from "uuid";
import {
  buyUnitDuringSetup,
  endSetupTurn,
  initializeCells,
  initializeGame,
  initializePlayers,
  initializeSetup,
  upgradeCellDuringSetup,
} from "./logic/setup-actions";
import { getMapForId } from "./map.server";
import { prisma } from "~/db.server";
import { Point } from "~/grid-math";
import { SetupState } from "~/domain/logic/game";
import { buyUnit } from "~/domain/logic/game-actions";

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

  return games.map((g) => ({
    ...g,
    gameState: g.gameState as PlayingState | null,
    players: g.players.map((p) => ({
      ...p,
      setupState: p.setupState as SetupState | null,
    })),
  }));
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

export async function startSetupPhase(id: string, userId: string) {
  const game = await requireGame(id);
  if (game.players.length < 2) {
    throw new Error("Game needs at least 2 players");
  }

  if (game.phase !== "LOBBY") {
    throw new Error("Game is already started");
  }

  if (game.creatorId !== userId) {
    throw new Error("Only the game creator can start the game");
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

export async function buy(
  id: string,
  playerId: string,
  position: Point,
  unitId: UnitId
) {
  const game = await requireGame(id);
  if (game.phase === "PREPARATION")
    return buyUnitP(id, playerId, position, unitId);
  else return buyUnitG(id, playerId, position, unitId);
}

export async function upgrade(id: string, playerId: string, position: Point) {
  const game = await requireGame(id);
  if (game.phase === "PREPARATION") return upgradeUnitP(id, playerId, position);
  else return upgradeUnitG(id, playerId, position);
}

export async function end(id: string, playerId: string) {
  const game = await requireGame(id);
  if (game.phase === "PREPARATION") return endTurnP(id, playerId);
  else return endTurnG(id, playerId);
}

export async function buyUnitP(
  id: string,
  playerId: string,
  position: Point,
  unitId: UnitId
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

export async function buyUnitG(
  id: string,
  playerId: string,
  position: Point,
  unitId: UnitId
) {
  const game = await requireGame(id);
  if (game.phase !== "PLAYING") {
    throw new Error("Game is already started");
  }

  const player = game.players.find((player) => player.id === playerId);

  if (!player) {
    throw new Error("Player not found");
  }

  const gameState = game.gameState as PlayingState;

  const newState = buyUnit(gameState, {
    senderId: playerId,
    position,
    unitId,
  });

  return await prisma.game.update({
    where: { id },
    data: {
      gameState: newState,
    },
  });
}

export async function upgradeUnitP(
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

export async function upgradeUnitG(
  id: string,
  playerId: string,
  position: Point
) {
  const game = await requireGame(id);
  if (game.phase !== "PLAYING") {
    throw new Error("Game is already started");
  }

  const player = game.players.find((player) => player.id === playerId);

  if (!player) {
    throw new Error("Player not found");
  }

  const gameState = game.gameState as PlayingState;

  const newState = upgradeCell(gameState, {
    senderId: playerId,
    position,
  });

  return await prisma.game.update({
    where: { id },
    data: {
      gameState: newState,
    },
  });
}

export async function endTurnP(id: string, playerId: string) {
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

export async function endTurnG(id: string, playerId: string) {
  const game = await requireGame(id);
  if (game.phase !== "PLAYING") {
    throw new Error("Game is already started");
  }

  const player = game.players.find((player) => player.id === playerId);

  if (!player) {
    throw new Error("Player not found");
  }

  const gameState = game.gameState as PlayingState;

  const newState = endTurn(gameState, {
    senderId: playerId,
  });

  return await prisma.game.update({
    where: { id },
    data: {
      gameState: newState,
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
            setupState: "",
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

export async function attack(
  id: string,
  playerId: string,
  position: Point,
  targetPosition: Point
) {
  const game = await requireGame(id);
  if (game.phase !== "PLAYING") {
    throw new Error("Game is not started yet");
  }

  const gameState = game.gameState as PlayingState;

  const newState = attackCell(gameState, {
    seed: uuid(),
    position,
    targetPosition,
    senderId: playerId,
  });

  return await prisma.game.update({
    where: { id },
    data: {
      gameState: newState,
    },
  });
}

export const isPlayerAlreadyInGame = async (id: string, playerId: string) => {
  const game = await requireGame(id);
  return game.players.some((p) => p.id === playerId);
};

export type GState = {
  playerCells: CellState[];
  players: PlayerState[];
  playerId: string;
  canTakeAction: boolean;
  phase: GamePhase;
};
