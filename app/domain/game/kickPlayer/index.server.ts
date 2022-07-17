import { addMinutes } from "date-fns";
import { PlayingState, PreparationState } from "~/core/actions/types";
import { prisma } from "~/db.server";
import {
  finishGame,
  requireGameAndPlayer,
  requireGameState,
  startGame,
  updateGameState,
} from "../game.server";
import { kickPlayerAction } from "./action";

export async function kickPlayer(id: string, playerId: string) {
  const { game, player } = await requireGameAndPlayer(id, playerId, [
    "PREPARATION",
    "PLAYING",
  ]);

  const state = requireGameState(game, player);

  const newState = kickPlayerAction(state, {
    playerId,
  });

  if ("done" in newState) {
    const setupDone =
      newState.done &&
      game.players
        .filter((p) => p.id !== playerId)
        .map((p) => p.preparationState as PreparationState)
        .every((state) => state.done);

    await prisma.playerTimeout.delete({
      where: {
        playerId: player.id,
      },
    });

    const updatedPlayer = await prisma.player.update({
      where: { id: player.id },
      data: {
        preparationState: newState,
      },
    });

    if (setupDone) {
      return await startGame(id);
    }

    return updatedPlayer;
  }

  await prisma.playerTimeout.deleteMany({
    where: {
      gameId: game.id,
    },
  });

  await prisma.playerTimeout.create({
    data: {
      gameId: game.id,
      playerId: newState.playerIdSequence[0],
      timeoutAt: addMinutes(Date.now(), game.minutesToTimeout),
    },
  });

  const updatedGame = await updateGameState(game, newState, player);
  const latestGameState = updatedGame.states[
    updatedGame.states.length - 1
  ] as PlayingState;
  if (latestGameState.playerIdSequence.length < 2) {
    return await finishGame(id);
  }

  return updatedGame;
}
