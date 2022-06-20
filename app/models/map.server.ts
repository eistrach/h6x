import { Cell, HexMap as PrismaHexMap } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getMapsForUser(creatorId: string) {
  return prisma.hexMap.findMany({
    where: {
      creatorId,
    },
  });
}

export async function getMap(id: string) {
  return prisma.hexMap.findUnique({
    where: {
      id,
    },
    include: {
      cells: true,
    },
  });
}

export async function createMap(creatorId: string, name: string) {
  return prisma.hexMap.create({
    data: {
      creatorId,
      name,
    },
  });
}

export async function updateCells(mapId: string, cells: Cell[]) {
  await prisma.cell.deleteMany({
    where: {
      mapId,
    },
  });

  await prisma.cell.createMany({
    data: cells,
  });
}

export type HexMap = PrismaHexMap & {
  cells: Cell[];
};
