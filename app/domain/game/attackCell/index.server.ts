import { Point } from "~/core/math";
import { requireGame, requirePlayingState } from "../game.server";
import { v4 as uuid } from "uuid";
import { prisma } from "~/db.server";
import { attackCellAction } from "./action";

export async function attackCell(
  id: string,
  senderPlayerId: string,
  source: Point,
  target: Point
) {
  const game = await requireGame(id, ["PLAYING"]);
  const state = requirePlayingState(game);

  const newState = attackCellAction(state, {
    seed: uuid(),
    source,
    target,
    senderPlayerId,
  });

  return await prisma.game.update({
    where: { id },
    data: {
      gameState: newState,
    },
  });
}
