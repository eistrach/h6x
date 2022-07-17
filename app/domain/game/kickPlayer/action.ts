import { registerAction } from "~/core/actions";
import { PlayingState, PreparationState } from "~/core/actions/types";

const kickPlayerReducer = (
  state: PlayingState | PreparationState,
  payload: {
    playerId: string;
  }
) => {
  state.playerIdSequence = state.playerIdSequence.filter(
    (id) => id !== payload.playerId
  );
  state.turn++;

  Object.keys(state.cells)
    .filter((k) => state.cells[k].ownerId === payload.playerId)
    .forEach((k) => (state.cells[k].ownerId = "kicked"));

  if ("done" in state) state.done = true;
};

export const kickPlayerAction = registerAction(
  "kickPlayer",
  [],
  kickPlayerReducer
);
