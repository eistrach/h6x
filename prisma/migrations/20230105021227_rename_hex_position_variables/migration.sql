/*
  Warnings:

  - The primary key for the `GameCell` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `x` on the `GameCell` table. All the data in the column will be lost.
  - You are about to drop the column `y` on the `GameCell` table. All the data in the column will be lost.
  - The primary key for the `HexMapTile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `x` on the `HexMapTile` table. All the data in the column will be lost.
  - You are about to drop the column `y` on the `HexMapTile` table. All the data in the column will be lost.
  - The primary key for the `PreparationCell` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `x` on the `PreparationCell` table. All the data in the column will be lost.
  - You are about to drop the column `y` on the `PreparationCell` table. All the data in the column will be lost.
  - Added the required column `q` to the `GameCell` table without a default value. This is not possible if the table is not empty.
  - Added the required column `r` to the `GameCell` table without a default value. This is not possible if the table is not empty.
  - Added the required column `q` to the `HexMapTile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `r` to the `HexMapTile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `q` to the `PreparationCell` table without a default value. This is not possible if the table is not empty.
  - Added the required column `r` to the `PreparationCell` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameCell" DROP CONSTRAINT "GameCell_pkey",
DROP COLUMN "x",
DROP COLUMN "y",
ADD COLUMN     "q" INTEGER NOT NULL,
ADD COLUMN     "r" INTEGER NOT NULL,
ADD CONSTRAINT "GameCell_pkey" PRIMARY KEY ("q", "r", "stateId");

-- AlterTable
ALTER TABLE "HexMapTile" DROP CONSTRAINT "HexMapTile_pkey",
DROP COLUMN "x",
DROP COLUMN "y",
ADD COLUMN     "q" INTEGER NOT NULL,
ADD COLUMN     "r" INTEGER NOT NULL,
ADD CONSTRAINT "HexMapTile_pkey" PRIMARY KEY ("q", "r");

-- AlterTable
ALTER TABLE "PreparationCell" DROP CONSTRAINT "PreparationCell_pkey",
DROP COLUMN "x",
DROP COLUMN "y",
ADD COLUMN     "q" INTEGER NOT NULL,
ADD COLUMN     "r" INTEGER NOT NULL,
ADD CONSTRAINT "PreparationCell_pkey" PRIMARY KEY ("q", "r", "stateId", "gameId");
