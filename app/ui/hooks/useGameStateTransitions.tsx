import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { AnimationDelay } from "~/config/graphics";
import { Point } from "~/core/math";
import { toId } from "~/core/utils";
import { useGameState } from "../context/GameContext";
import { useSelectedCell } from "../context/SelectedCellContext";

export const useGameStateTransitions = () => {
  const { state, nextState } = useGameState();
  const { setSelectedCell } = useSelectedCell();
  const fetcher = useFetcher();

  const currentStateId = JSON.stringify(state);
  const nextStateId = JSON.stringify(nextState);

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!!nextState) setIsTransitioning(true);
    const timeout = setTimeout(() => {
      if (nextState)
        fetcher.submit(
          { _intent: "transitionToNextGameState" },
          { method: "post" }
        );
      setIsTransitioning(false);
    }, AnimationDelay);
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

  return isTransitioning;
};
