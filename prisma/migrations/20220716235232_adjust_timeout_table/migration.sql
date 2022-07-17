/*
  Warnings:

  - The primary key for the `PlayerTimeout` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PlayerTimeout` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlayerTimeout" DROP CONSTRAINT "PlayerTimeout_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "PlayerTimeout_pkey" PRIMARY KEY ("playerId");
