import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { CellState, PlayingState } from "~/core/actions/types";
import { Point } from "~/core/math";
import { toId } from "~/core/utils";

export const useGameStateTransitions = (
  state: PlayingState,
  nextState: PlayingState | undefined,
  setSelectedCell: (cell: CellState | null, force?: boolean) => void
) => {
  const fetcher = useFetcher();

  const currentStateId = JSON.stringify(state);
  const nextStateId = JSON.stringify(nextState);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (nextState)
        fetcher.submit(
          { _intent: "transitionToNextGameState" },
          { method: "post" }
        );
    }, 500);
    return () => clearTimeout(timeout);
  }, [nextStateId]);

  useEffect(() => {
    if (!state?.causedBy) return;
    if (state.causedBy.name === "attackCell") {
      const payload = state.causedBy.payload as {
        source: Point;
        target: Point;
      };
      const sourceCell = state.cells[toId(payload.source)];
      const targetCell = state.cells[toId(payload.target)];
      const hasWon = sourceCell.ownerId === targetCell.ownerId;
      if (hasWon) {
        const cell = state.cells[toId(payload.target)];

        setSelectedCell(cell, true);
      }
    } else if (!!state && "source" in state.causedBy.payload) {
      const cell = state.cells[toId(state.causedBy.payload.source)];
      setSelectedCell(cell, true);
    } else {
      setSelectedCell(null, true);
    }
  }, [currentStateId]);
};
