import { prisma } from "~/db.server";

export async function getGame(id: string) {
  return prisma.game.findUnique({
    where: {
      id,
    },
    include: {
      map: true,
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

/*export async function createGame(creatorId: string, mapId: string) {
  const map = await getMap(mapId);

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
            position: 0,
          },
        ],
      },
    },
  });
}

export async function addPlayer(id: string, userId: string) {
  const game = await requireGame(id);

  if (game.players.some((player) => player.userId === userId)) {
    throw new Error("User is already in the game");
  }

  if (game.phase !== "LOBBY") {
    throw new Error("Game is already started");
  }

  return await prisma.game.update({
    where: { id },
    data: {
      players: {
        create: [
          ...game.players,
          {
            userId,
            position: game.players.length,
          },
        ],
      },
    },
  });
}

export async function startGame(id: string) {
  const game = await requireGame(id);
  if (game.players.length < 2) {
    throw new Error("Game needs at least 2 players");
  }

  if (game.phase !== "LOBBY") {
    throw new Error("Game is already started");
  }

  const map = await getMap(game.mapId);

  const availableCells = map!.cells
    .filter((cell) => cell.type === "PLAYER")
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  const playerCellCount = Math.floor(
    availableCells.length / game.players.length
  );

  const cells = game.players.flatMap((player) => {
    const cells = availableCells.splice(0, playerCellCount);
    return cells.map((cell) => {
      return {
        cellId: cell.id,
        gameId: game.id,
        playerId: player.id,
      };
    });
  });

  // use remaining available cells for dummy placement

  prisma.game.update({
    where: {
      id,
    },
    data: {
      cells: {
        create: cells,
      },
    },
  });
}

// executeAction, endTurn, endGame

*/
