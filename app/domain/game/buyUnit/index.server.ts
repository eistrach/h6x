import { buyUnitAction } from "./action";
import { prisma } from "~/db.server";

import { requireGameAndPlayer, requireGameState } from "../game.server";
import { Point } from "~/core/math";

export async function buyUnit(id: string, playerId: string, source: Point) {
  const { game, player } = await requireGameAndPlayer(id, playerId, [
    "PLAYING",
    "PREPARATION",
  ]);

  const state = requireGameState(game, player);

  const newState = buyUnitAction(state, {
    senderPlayerId: playerId,
    source,
  });

  if (game.phase === "PREPARATION") {
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
