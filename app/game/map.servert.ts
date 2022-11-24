import { prisma } from "~/lib/db.server";

export const getMapById = async (id: string) => {
  return await prisma.hexMap.findUnique({
    where: { id },
    include: { tiles: true },
  });
};

export const getAllPublishedMaps = async () => {
  return await prisma.hexMap.findMany({
    where: { published: true },
    include: { tiles: true },
  });
};
