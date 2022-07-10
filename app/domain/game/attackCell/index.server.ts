import { Point } from "~/core/math";
import {
  requireGameAndPlayer,
  requirePlayingState,
  updateGameState,
} from "../game.server";
import { v4 as uuid } from "uuid";
import { attackCellAction } from "./action";

export async function attackCell(
  id: string,
  senderPlayerId: string,
  source: Point,
  target: Point
) {
  const { game, player } = await requireGameAndPlayer(id, senderPlayerId, [
    "PLAYING",
  ]);
  const state = requirePlayingState(game);

  const newState = attackCellAction(state, {
    seed: uuid(),
    source,
    target,
    senderPlayerId,
  });

  return updateGameState(game, newState, player);
}
