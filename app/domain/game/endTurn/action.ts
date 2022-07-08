import { isPlayingState } from "./../utils";
import { isSendersTurn } from "./../../../core/actions/validations";
import { ModeChangesPerTurn } from "~/config/rules";
import { registerAction } from "~/core/actions";
import { PlayingState, PreparationState } from "~/core/actions/types";
import {
  calculateDiamondsForPlayer,
  getCurrentPlayer,
  getNextPlayer,
} from "../utils";

const endTurnReducer = (state: PlayingState | PreparationState) => {
  const player = getCurrentPlayer(state);
  player.availableModeChanges = ModeChangesPerTurn;

  const nextPlayer = getNextPlayer(state);
  if (nextPlayer) {
    nextPlayer.diamonds += calculateDiamondsForPlayer(state, nextPlayer);
  }

  const [id, ...rest] = state.playerIdSequence;
  state.playerIdSequence = [...rest, id];
  state.turn++;

  if ("done" in state) state.done = true;
};

export const endTurnAction = registerAction(
  "endTurn",
  [isSendersTurn],
  endTurnReducer
);
