import type { HexMapTile, SupportedCellMode, User } from "@prisma/client";
import { prisma } from "~/lib/db.server";
import { ExtractReturnType } from "~/lib/type-helpers";
import { getGameById } from "./game.server";

export type PreparationState = ExtractReturnType<typeof getPreparationState>;

export const getPreparationState = async (gameId: string, user: User) => {
  const game = await prisma.game.findFirst({
    where: { id: gameId, phase: "Preparing" },
    include: { members: true, preparationStates: { include: { cells: true } } },
  });
  if (!game)
    throw Error(
      `Game '${gameId}' does not satifisy the filtering requirements`
    );
  if (!game.members.find((m) => m.id === user.id))
    throw Error(`User '${user.id}' is not a member of game '${gameId}'`);

  const { preparationStates, ...rest } = game;
  const preparationState = preparationStates.find((p) => p.userId === user.id);

  if (!preparationState)
    throw Error(`User '${user.id}' does not have a preparation state`);

  const getIndex = (userId: string) => {
    const index = preparationStates.find((p) => p.userId === userId)?.index;
    if (index === undefined)
      throw Error(`User '${userId}' does not have a preparation state`);
    return index;
  };

  return {
    ...rest,
    ...preparationState,
    members: game.members
      .map((m) => ({
        ...m,
        index: getIndex(m.id),
      }))
      .sort((a, b) => a.index - b.index),
    phase: "Preparing" as const,
    canTakeAction: true,
  };
};

export const transitionToPreparationState = async (
  user: User,
  gameId: string
) => {
  const game = await getGameById(gameId);
  if (!game) throw Error(`game '${gameId}' not found`);
  if (game.creatorId !== user.id)
    throw Error(`User '${user.id}' is not the creator of game '${gameId}'`);
  if (game.members.length < 2)
    throw Error(`Game '${gameId}' does not have enough members`);
  if (game.members.length > 6)
    throw Error(`Game '${gameId}' has too many members`);
  if (game.phase !== "Waiting")
    throw Error(`Game '${gameId}' is not in the 'Waiting' state`);

  const players = ranodomize(game.members).map((m, index) => ({
    index,
    userId: m.id,
  }));

  const cells = initializeCells(game.map.tiles, players);

  const preparationStates = players.map(({ userId, index }) => ({
    index,
    diamonds: Math.floor(game.map.tiles.length / game.members.length),
    userId,
    cells: {
      createMany: {
        data: cells,
      },
    },
  }));

  return await prisma.game.update({
    where: {
      id: gameId,
    },
    data: {
      phase: "Preparing",
      preparationStates: {
        create: preparationStates,
      },
    },
  });
};

export const changeCellMode = async (
  user: User,
  gameId: string,
  preparationStateIndex: number,
  q: number,
  r: number,
  cellModeCode: SupportedCellMode
) => {
  const preparationState = await prisma.preparationState.findUnique({
    where: {
      index_gameId: {
        index: preparationStateIndex,
        gameId: gameId,
      },
    },
    include: { cells: true, actions: true },
  });

  if (!preparationState)
    throw Error(
      `Preparation state '${preparationStateIndex}|${gameId}' not found`
    );
  if (preparationState.userId !== user.id)
    throw Error(
      `User '${user.id}' does not have permission to change the cell mode`
    );

  const cell = preparationState.cells.find((c) => c.q === q && c.r === r);
  if (!cell) throw Error(`Cell '${q}|${r}' not found`);
  if (cell.ownerId !== user.id)
    throw Error(`Cell '${q}|${r}' is not owned by user '${user.id}'`);
  if (cell.activeModeCode === cellModeCode)
    throw Error(`Cell '${q}|${r}' is already in mode '${cellModeCode}'`);

  return prisma.preparationState.update({
    where: {
      index_gameId: {
        index: preparationStateIndex,
        gameId: gameId,
      },
    },
    data: {
      actions: {
        create: {
          code: "ChangeCellMode",
          payload: {
            q,
            r,
            cellModeCode,
          },
          sequenceId: preparationState.actions.length,
        },
      },
      cells: {
        update: {
          where: {
            q_r_stateId_gameId: {
              q,
              r,
              stateId: preparationStateIndex,
              gameId,
            },
          },
          data: {
            activeModeCode: cellModeCode,
          },
        },
      },
    },
  });
};

const initializeCells = (
  tiles: HexMapTile[],
  players: { index: number; userId: string }[]
) => {
  const availableCells = ranodomize(tiles.filter((t) => t.type === "Player"));

  const playerCellCount = Math.floor(availableCells.length / players.length);

  const cells = players.flatMap((p) => {
    const cells = availableCells.splice(0, playerCellCount);
    return cells.map((cell) => {
      return createPlayerCell(cell, "Defensive", p.userId);
    });
  });

  const neutralCells = availableCells.map((cell) => {
    return createPlayerCell(cell, "Defensive");
  });

  return [...cells, ...neutralCells];
};

export const createPlayerCell = (
  tile: HexMapTile,
  activeModeCode: SupportedCellMode,
  ownerId: string | null = null
) => {
  return {
    q: tile.q,
    r: tile.r,
    activeModeCode,
    ownerId,
    units: 1,
  };
};

const ranodomize = <T>(array: T[]) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};
