import { getCurrentPlayer } from "~/domain/game/utils";

import { Point } from "../math";
import { toId } from "../utils";
import { PlayingState } from "./types";

export const isSendersTurn = (
  state: PlayingState,
  { senderPlayerId }: { senderPlayerId: string }
) => {
  const currentPlayer = getCurrentPlayer(state);
  if (currentPlayer.id !== senderPlayerId) {
    throw new Error("It's not your turn");
  }
};

export const isPlayerCellOwner = (
  state: PlayingState,
  { source }: { source: Point }
) => {
  const currentPlayer = getCurrentPlayer(state);
  const cell = state.cells[toId(source)];
  if (cell.ownerId !== currentPlayer.id) {
    throw new Error("Cell is not yours");
  }
};
