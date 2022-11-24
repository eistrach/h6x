-- CreateEnum
CREATE TYPE "TileType" AS ENUM ('Player', 'Buff');

-- CreateEnum
CREATE TYPE "GamePhase" AS ENUM ('Waiting', 'Preparing', 'Playing', 'Finished');

-- CreateEnum
CREATE TYPE "EliminationReason" AS ENUM ('Eliminated', 'Surrendered', 'Timeout');

-- CreateEnum
CREATE TYPE "SupportedCellMode" AS ENUM ('Offensive', 'Defensive', 'Productive');

-- CreateEnum
CREATE TYPE "SupportedPreparationActions" AS ENUM ('BuyUnit', 'ChangeCellMode');

-- CreateEnum
CREATE TYPE "SupportedGameActions" AS ENUM ('AttackCell', 'BuyUnit', 'ChangeCellMode', 'EliminatePlayer', 'EndTurn');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nickname" TEXT NOT NULL,
    "username" TEXT,
    "discordId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Password" (
    "hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "HexMap" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL,

    CONSTRAINT "HexMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HexMapTile" (
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "mapId" TEXT,
    "type" "TileType" NOT NULL DEFAULT 'Player',

    CONSTRAINT "HexMapTile_pkey" PRIMARY KEY ("x","y")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mapId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "minutesUntilTimeout" INTEGER NOT NULL DEFAULT 60,
    "phase" "GamePhase" NOT NULL DEFAULT 'Waiting',

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreparationState" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "index" INTEGER NOT NULL,
    "gameId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "diamonds" INTEGER NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PreparationState_pkey" PRIMARY KEY ("index","gameId")
);

-- CreateTable
CREATE TABLE "PreparationCell" (
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "gameId" TEXT NOT NULL,
    "stateId" INTEGER NOT NULL,
    "activeModeCode" "SupportedCellMode" NOT NULL DEFAULT 'Defensive',
    "units" INTEGER NOT NULL,
    "ownerId" TEXT,

    CONSTRAINT "PreparationCell_pkey" PRIMARY KEY ("x","y","stateId","gameId")
);

-- CreateTable
CREATE TABLE "PreparationAction" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sequenceId" INTEGER NOT NULL,
    "code" "SupportedPreparationActions" NOT NULL,
    "payload" JSONB NOT NULL,
    "stateId" INTEGER NOT NULL,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "PreparationAction_pkey" PRIMARY KEY ("sequenceId","stateId","gameId")
);

-- CreateTable
CREATE TABLE "GameState" (
    "id" INTEGER NOT NULL,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "GameState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GamePlayer" (
    "index" INTEGER NOT NULL,
    "stateId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "diamonds" INTEGER NOT NULL,
    "availableModeChanges" INTEGER NOT NULL,
    "eliminationReason" "EliminationReason",

    CONSTRAINT "GamePlayer_pkey" PRIMARY KEY ("index","stateId")
);

-- CreateTable
CREATE TABLE "GameCell" (
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "stateId" INTEGER NOT NULL,
    "ownerIndex" INTEGER,
    "activeModeCode" TEXT NOT NULL,
    "units" INTEGER NOT NULL,

    CONSTRAINT "GameCell_pkey" PRIMARY KEY ("x","y","stateId")
);

-- CreateTable
CREATE TABLE "GameAction" (
    "sequenceId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "nextStateId" INTEGER NOT NULL,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "GameAction_pkey" PRIMARY KEY ("sequenceId","gameId")
);

-- CreateTable
CREATE TABLE "_GameToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "Password_userId_key" ON "Password"("userId");

-- CreateIndex
CREATE INDEX "HexMap_creatorId_idx" ON "HexMap"("creatorId");

-- CreateIndex
CREATE UNIQUE INDEX "_GameToUser_AB_unique" ON "_GameToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_GameToUser_B_index" ON "_GameToUser"("B");

-- AddForeignKey
ALTER TABLE "Password" ADD CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HexMap" ADD CONSTRAINT "HexMap_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HexMapTile" ADD CONSTRAINT "HexMapTile_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "HexMap"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "HexMap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreparationState" ADD CONSTRAINT "PreparationState_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreparationState" ADD CONSTRAINT "PreparationState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreparationCell" ADD CONSTRAINT "PreparationCell_stateId_gameId_fkey" FOREIGN KEY ("stateId", "gameId") REFERENCES "PreparationState"("index", "gameId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreparationCell" ADD CONSTRAINT "PreparationCell_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreparationAction" ADD CONSTRAINT "PreparationAction_stateId_gameId_fkey" FOREIGN KEY ("stateId", "gameId") REFERENCES "PreparationState"("index", "gameId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameState" ADD CONSTRAINT "GameState_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamePlayer" ADD CONSTRAINT "GamePlayer_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "GameState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamePlayer" ADD CONSTRAINT "GamePlayer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameCell" ADD CONSTRAINT "GameCell_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "GameState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameCell" ADD CONSTRAINT "GameCell_ownerIndex_stateId_fkey" FOREIGN KEY ("ownerIndex", "stateId") REFERENCES "GamePlayer"("index", "stateId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameAction" ADD CONSTRAINT "GameAction_nextStateId_fkey" FOREIGN KEY ("nextStateId") REFERENCES "GameState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameAction" ADD CONSTRAINT "GameAction_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameToUser" ADD CONSTRAINT "_GameToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameToUser" ADD CONSTRAINT "_GameToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
