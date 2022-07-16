import { useFetcher, useTransition } from "@remix-run/react";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  AttackTransitionDelay,
  CellSelectionDelay,
  DefaultTransitionDelay,
} from "~/config/animations";
import { compareCell } from "~/core/math";
import { toId } from "~/core/utils";
import { usePrevious } from "../hooks/usePrevious";
import { useGameState } from "./GameContext";
import { useSelectedCell } from "./SelectedCellContext";

export const TransitionContext = createContext<null | string>(null);
export const TransitionContextProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const { state, nextState, playerId } = useGameState();
  const [transition, setTransition] = useState<null | string>(null);
  const { selectedCell, setSelectedCell } = useSelectedCell();

  const remixTransition = useTransition();
  const previousRemixTransition = usePrevious(remixTransition);

  const fetcher = useFetcher();

  const gotoNextState = () => {
    fetcher.submit(
      {
        _intent: "transitionToNextGameState",
        playerId: playerId || "",
      },
      { method: "post" }
    );
  };

  const playAnimations = async () => {
    await selectCellIfNeeded();
    await wait(DefaultTransitionDelay);

    setTransition(nextState?.causedBy.name || null);

    const delay =
      nextState?.causedBy.name === "attackCell"
        ? AttackTransitionDelay + 10
        : 0;
    await wait(delay);
    setTransition(null);
    gotoNextState();
  };

  const selectCellIfNeeded = async () => {
    setTransition("selectingCell");
    if ("source" in nextState!.causedBy.payload) {
      const cell = nextState!.cells[toId(nextState!.causedBy.payload.source)];
      if (compareCell(cell.position, selectedCell?.position)) return;
      setSelectedCell(cell, true);
      await wait(CellSelectionDelay);
    }
  };

  useEffect(() => {
    if (!nextState) return;
    playAnimations();
  }, [nextState?.stateId]);

  useEffect(() => {
    if (
      remixTransition.state === "idle" &&
      previousRemixTransition?.state === "loading"
    ) {
      if (state.causedBy.name === "attackCell") {
        const targetPosition = state.causedBy.payload.target;
        const targetCell = state.cells[toId(targetPosition)];
        if (targetCell?.ownerId === selectedCell?.ownerId) {
          setSelectedCell(targetCell, true);
        }
      }
    }
  }, [previousRemixTransition]);

  return (
    <TransitionContext.Provider value={transition}>
      {children}
    </TransitionContext.Provider>
  );
};
export const useGameTransition = () => {
  return useContext(TransitionContext)!;
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
