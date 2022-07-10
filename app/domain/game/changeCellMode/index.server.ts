import { CellModeId } from "~/config/rules";
import { prisma } from "~/db.server";

import {
  requireGameAndPlayer,
  requireGameState,
  updateGameState,
} from "../game.server";
import { changeCellModeAction } from "./action";
import { Point } from "~/core/math";

export async function changeCellMode(
  id: string,
  playerId: string,
  source: Point,
  modeId: CellModeId
) {
  const { game, player } = await requireGameAndPlayer(id, playerId, [
    "PLAYING",
    "PREPARATION",
  ]);

  const state = requireGameState(game, player);
  const newState = changeCellModeAction(state, {
    senderPlayerId: playerId,
    source,
    modeId,
  });

  if (game.phase === "PREPARATION") {
    return await prisma.player.update({
      where: { id: player.id },
      data: {
        preparationState: newState,
      },
    });
  }

  return updateGameState(game, newState);
}
