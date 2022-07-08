/*
  Warnings:

  - You are about to drop the column `setupState` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "setupState",
ADD COLUMN     "preparationState" JSONB;

