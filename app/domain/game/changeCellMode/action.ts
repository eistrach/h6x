import { isPlayingState } from "./../utils";
import { CellModeId } from "~/config/rules";
import { registerAction } from "~/core/actions";
import { PlayingState } from "~/core/actions/types";
import { isSendersTurn, isPlayerCellOwner } from "~/core/actions/validations";
import { Point } from "~/core/math";
import { toId } from "~/lib/utils";
import { getCurrentPlayer } from "../utils";

const changeCellModeReducer = (
  state: PlayingState,
  payload: { senderPlayerId: string; source: Point; modeId: CellModeId }
) => {
  const player = getCurrentPlayer(state);
  const cell = state.cells[toId(payload.source)];

  if (isPlayingState(state)) player.availableModeChanges--;
  cell.activeModeId = payload.modeId;
};

export const isDifferentMode = (
  state: PlayingState,
  { source, modeId }: { source: Point; modeId: string }
) => {
  const cell = state.cells[toId(source)];
  if (cell.activeModeId === modeId) {
    throw new Error("Cell is already in this mode");
  }
};

export const canAffordModeChange = (state: PlayingState) => {
  const currentPlayer = getCurrentPlayer(state);

  if (isPlayingState(state) && currentPlayer.availableModeChanges <= 0) {
    throw new Error("You don't have enough diamonds");
  }
};

export const changeCellModeAction = registerAction(
  "changeCellMode",
  [isSendersTurn, canAffordModeChange, isPlayerCellOwner, isDifferentMode],
  changeCellModeReducer
);
