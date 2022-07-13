import { useFetcher } from "@remix-run/react";
import { MotionProps } from "framer-motion";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  CellSelectionDelay,
  getTransitionForAction,
} from "~/config/animations";
import { compareCell, Point } from "~/core/math";
import { toId } from "~/core/utils";
import { useGameState } from "./GameContext";
import { useSelectedCell } from "./SelectedCellContext";

export const TransitionContext = createContext<
  | null
  | "selectingCell"
  | { getMotionProps: (cell: Point) => MotionProps | null }
>(null);
export const TransitionContextProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const { state, nextState, playerId } = useGameState();
  const [transition, setTransition] = useState<
    | null
    | "selectingCell"
    | { getMotionProps: (cell: Point) => MotionProps | null }
  >(null);
  const { selectedCell, setSelectedCell } = useSelectedCell();

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
    const anim = getTransitionForAction(nextState!.causedBy.name);

    const motionForSource = anim.onTransition?.sourceCell?.(
      nextState?.causedBy.payload
    );
    const motionForTarget = anim.onTransition?.targetCell?.(
      nextState?.causedBy.payload
    );

    const getMotionProps = (cell: Point) => {
      if (compareCell(cell, nextState?.causedBy.payload.source)) {
        return motionForSource || null;
      }
      if (compareCell(cell, nextState?.causedBy.payload.target)) {
        return motionForTarget || null;
      }
      return null;
    };

    setTransition({ getMotionProps });
    await wait(anim.onTransition.duration);
    setTransition(null);

    gotoNextState();

    const wonAttack =
      nextState?.causedBy.name === "attackCell" &&
      nextState.cells[toId(nextState.causedBy.payload.target)]?.ownerId ===
        nextState.cells[toId(nextState.causedBy.payload.source)]?.ownerId;

    if (wonAttack) {
      await wait(CellSelectionDelay);
    }

    if (wonAttack) {
      setSelectedCell(
        nextState.cells[toId(nextState.causedBy.payload.target)],
        true
      );
    }
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
