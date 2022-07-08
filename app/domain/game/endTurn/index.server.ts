import { PreparationState } from "~/core/actions/types";
import { prisma } from "~/db.server";
import {
  requireGameAndPlayer,
  requireGameState,
  startGame,
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

    return await prisma.player.update({
      where: { id: player.id },
      data: {
        preparationState: newState,
      },
    });
  }

  return await prisma.game.update({
    where: { id },
    data: {
      gameState: newState,
    },
  });
}
