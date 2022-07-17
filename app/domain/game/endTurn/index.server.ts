import { addMinutes } from "date-fns";
import { PreparationState } from "~/core/actions/types";
import { prisma } from "~/db.server";
import {
  requireGameAndPlayer,
  requireGameState,
  startGame,
  updateGameState,
} from "../game.server";
import { endTurnAction } from "./action";

export async function endTurn(id: string, senderPlayerId: string) {
  const { game, player } = await requireGameAndPlayer(id, senderPlayerId, [
    "PREPARATION",
    "PLAYING",
  ]);

  const state = requireGameState(game, player);

  const newState = endTurnAction(state, {
    senderPlayerId,
  });

  if ("done" in newState) {
    const setupDone =
      newState.done &&
      game.players
        .filter((p) => p.id !== senderPlayerId)
        .map((p) => p.preparationState as PreparationState)
        .every((state) => state.done);

    if (setupDone) {
      return await startGame(id);
    }

    await prisma.playerTimeout.delete({
      where: {
        playerId: player.id,
      },
    });

    return await prisma.player.update({
      where: { id: player.id },
      data: {
        preparationState: newState,
      },
    });
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

  return updateGameState(game, newState, player);
}
