import { Cell } from "@prisma/client";
import { prisma } from "~/db.server";
import { validateCellConnections } from "./validations";

export const getPublishedMaps = () => {
  return prisma.hexMap.findMany({
    where: {
      published: true,
    },
  });
};

export const getMapForId = (id: string) => {
  return prisma.hexMap.findUnique({
    where: {
      id,
    },
    include: {
      cells: true,
    },
  });
};

export const getMapsForUser = (creatorId: string) => {
  return prisma.hexMap.findMany({
    where: {
      creatorId,
    },
  });
};

export const getMapForUser = async (id: string, creatorId: string) => {
  const map = await prisma.hexMap.findFirst({
    where: {
      id,
      creatorId,
    },
    include: {
      cells: true,
    },
  });

  if (!map) {
    return null;
  }

  return map;
};

export const createMap = async (name: string, creatorId: string) => {
  return prisma.hexMap.create({
    data: {
      creatorId,
      name,
    },
  });
};

export const updateMap = async (
  { id, cells }: { id: string; cells: Omit<Cell, "id">[] },
  creatorId: string
) => {
  if (!(await isMapCreator(id, creatorId))) {
    throw new Error("You are not the creator of this map");
  }

  await updateCells(id, cells);

  await prisma.hexMap.update({
    where: {
      id,
    },
    data: {
      published: false,
    },
  });

  return id;
};

export const toggleMapVisibility = async (
  id: string,
  creatorId: string,
  cells: Omit<Cell, "id">[]
) => {
  if (!(await isMapCreator(id, creatorId))) {
    throw new Error("You are not the creator of this map");
  }

  const isPublished = await isMapPublished(id);

  if (!isPublished && !validateCellConnections(cells)) {
    return null;
  }

  await updateCells(id, cells);

  return prisma.hexMap.update({
    where: {
      id,
    },
    data: {
      published: !isPublished,
    },
  });
};

export async function updateCells(mapId: string, cells: Omit<Cell, "id">[]) {
  await prisma.cell.deleteMany({
    where: {
      mapId,
    },
  });

  await prisma.cell.createMany({
    data: cells,
  });
}

export async function isMapCreator(mapId: string, userId: string) {
  return !!(await prisma.hexMap.count({
    where: {
      id: mapId,
      creatorId: userId,
    },
  }));
}

export async function isMapPublished(mapId: string) {
  return (
    await prisma.hexMap.findUnique({
      where: {
        id: mapId,
      },
      select: {
        published: true,
      },
    })
  )?.published;
}
