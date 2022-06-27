import { Cell } from "@prisma/client";
import { prisma } from "~/db.server";

export const getMaps = () => {
  return prisma.hexMap.findMany();
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

  await prisma.cell.deleteMany({
    where: {
      mapId: id,
    },
  });

  await prisma.cell.createMany({
    data: cells,
  });

  return id;
};

export async function isMapCreator(mapId: string, userId: string) {
  return !!prisma.hexMap.count({
    where: {
      id: mapId,
      creatorId: userId,
    },
  });
}
