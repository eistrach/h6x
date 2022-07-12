import { GameMap } from "@prisma/client";
import { prisma } from "~/db.server";
import { validateCellConnections } from "./validations";

export const CellType = ["buff", "player"] as const;

export type Cell = {
  x: number;
  y: number;
  type: typeof CellType[number];
};

export type CellsHistory = {
  cells: Cell[];
}[];

export const convertMap = (map: GameMap | null) =>
  map && {
    ...map,
    cellsHistory: map.cellsHistory as CellsHistory,
    cells: ((map.cellsHistory as CellsHistory)[map.cellsHistory.length - 1]
      ?.cells || []) as Cell[],
  };

export const convertMaps = (maps: GameMap[]) => maps.map((m) => convertMap(m)!);

export const getPublishedMaps = () => {
  return prisma.gameMap
    .findMany({
      where: {
        published: true,
      },
    })
    .then(convertMaps);
};

export const getMapForId = (id: string) => {
  return prisma.gameMap
    .findUnique({
      where: {
        id,
      },
    })
    .then(convertMap);
};

export const getMapsForUser = async (creatorId: string) => {
  const maps = await prisma.gameMap.findMany({
    where: {
      creatorId,
    },
  });

  return convertMaps(maps)!;
};

export const getMapForUser = async (id: string, creatorId: string) => {
  return await prisma.gameMap
    .findFirst({
      where: {
        id,
        creatorId,
      },
    })
    .then(convertMap);
};

export const createMap = async (name: string, creatorId: string) => {
  return prisma.gameMap.create({
    data: {
      creatorId,
      name,
    },
  });
};

export const updateMap = async (
  { id, cells }: { id: string; cells: Cell[] },
  creatorId: string
) => {
  if (!(await isMapCreator(id, creatorId))) {
    throw new Error("You are not the creator of this map");
  }

  const map = await getMapForId(id);

  if (!map) {
    throw new Error("Map not found");
  }

  await prisma.gameMap.update({
    where: {
      id,
    },
    data: {
      published: false,
      cellsHistory: [...map.cellsHistory.slice(10), { cells }],
    },
  });

  return id;
};

export const toggleMapVisibility = async (
  id: string,
  creatorId: string,
  cells: Cell[]
) => {
  if (!(await isMapCreator(id, creatorId))) {
    throw new Error("You are not the creator of this map");
  }

  const map = await getMapForId(id);

  if (!map) {
    throw new Error("Map not found");
  }

  const isPublished = map.published;

  if (!validateCellConnections(cells)) {
    return null;
  }

  return prisma.gameMap.update({
    where: {
      id,
    },
    data: {
      published: !isPublished,
      cellsHistory: [...map.cellsHistory.slice(10), { cells }],
    },
  });
};

export async function isMapCreator(mapId: string, userId: string) {
  return !!(await prisma.gameMap.count({
    where: {
      id: mapId,
      creatorId: userId,
    },
  }));
}

export async function isMapPublished(mapId: string) {
  return (
    await prisma.gameMap.findUnique({
      where: {
        id: mapId,
      },
      select: {
        published: true,
      },
    })
  )?.published;
}
