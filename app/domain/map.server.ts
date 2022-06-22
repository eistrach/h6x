import { makeDomainFunction } from "remix-domains";
import { prisma } from "~/db.server";
import {
  CreateMapSchema,
  IdSchema,
  NullSchema,
  RequireUserSchema,
  UpdateMapSchema,
} from "./schemas";
import { validateCellConnections } from "./validations";

export const getMapForId = makeDomainFunction(IdSchema)((id) => {
  return prisma.hexMap.findUnique({
    where: {
      id,
    },
    include: {
      cells: true,
    },
  });
});
export const getMapsForUser = makeDomainFunction(
  NullSchema,
  RequireUserSchema
)((_, { id: creatorId }) => {
  return prisma.hexMap.findMany({
    where: {
      creatorId,
    },
  });
});

export const getMapForUser = makeDomainFunction(
  IdSchema,
  RequireUserSchema
)(async (id, { id: creatorId }) => {
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
    throw new Error("Map not found or user is not the creator");
  }

  return map;
});

export const createMap = makeDomainFunction(
  CreateMapSchema,
  RequireUserSchema
)(async ({ name }, { id: creatorId }) => {
  return prisma.hexMap.create({
    data: {
      creatorId,
      name,
    },
  });
});

export const updateMap = makeDomainFunction(
  UpdateMapSchema,
  RequireUserSchema
)(async ({ id, cells }, { id: creatorId }) => {
  if (!(await isMapCreator(id, creatorId))) {
    throw new Error("You are not the creator of this map");
  }

  if (!validateCellConnections(cells)) {
    throw new Error("Cells are not connected");
  }

  await prisma.cell.deleteMany({
    where: {
      id,
    },
  });

  await prisma.cell.createMany({
    data: cells,
  });

  return id;
});

export async function isMapCreator(mapId: string, userId: string) {
  return !!prisma.hexMap.count({
    where: {
      id: mapId,
      creatorId: userId,
    },
  });
}
