import { UnitCost } from "~/config/rules";
import { registerAction } from "~/core/actions";
import { PlayingState } from "~/core/actions/types";
import { isSendersTurn, isPlayerCellOwner } from "~/core/actions/validations";
import { Point } from "~/core/math";
import { toId } from "~/core/utils";
import { getCurrentPlayer } from "../utils";

const buyUnitReducer = (
  state: PlayingState,
  payload: { senderPlayerId: string; source: Point }
) => {
  const player = getCurrentPlayer(state);
  const cell = state.cells[toId(payload.source)];

  player.diamonds -= UnitCost;
  cell.units++;
};

export const canAffordUnit = (state: PlayingState) => {
  const currentPlayer = getCurrentPlayer(state);
  if (currentPlayer.diamonds < UnitCost) {
    throw new Error("You don't have enough diamonds");
  }
};

export const buyUnitAction = registerAction(
  "buyUnit",
  [isSendersTurn, isPlayerCellOwner, canAffordUnit],
  buyUnitReducer
);
