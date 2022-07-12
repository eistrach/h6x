/*
  Warnings:

  - You are about to drop the `Cell` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HexMap` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cell" DROP CONSTRAINT "Cell_mapId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_mapId_fkey";

-- DropForeignKey
ALTER TABLE "HexMap" DROP CONSTRAINT "HexMap_creatorId_fkey";

-- DropTable
DROP TABLE "Cell";

-- DropTable
DROP TABLE "HexMap";

-- DropEnum
DROP TYPE "CellType";

-- CreateTable
CREATE TABLE "GameMap" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "cellsHistory" JSONB[],

    CONSTRAINT "GameMap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GameMap_creatorId_idx" ON "GameMap"("creatorId");

-- AddForeignKey
ALTER TABLE "GameMap" ADD CONSTRAINT "GameMap_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "GameMap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
