import { useTransition } from "@remix-run/react";
import { createContext, PropsWithChildren, useContext } from "react";
import { CellState } from "~/core/actions/types";
import {
  cellsAreNeighbors,
  compareCell,
  getNeighboringCells,
} from "~/core/math";
import { UnpackData } from "~/core/utils";
import { GameWithState } from "~/domain/game/game.server";
import { getCurrentPlayer } from "~/domain/game/utils";
import { useDirectionalPopovers } from "../hooks/useDirectionalPopovers";
import { useSelectedCell } from "./SelectedCellContext";

export const GameContext = createContext<
  | (GameWithState & {
      directionalPopovers: UnpackData<typeof useDirectionalPopovers>;
    })
  | undefined
>(undefined);

export const GameContextProvider = ({
  value,
  children,
}: PropsWithChildren<{ value: GameWithState | undefined }>) => {
  const directionalPopovers = useDirectionalPopovers();

  return (
    <GameContext.Provider
      value={value ? { ...value, directionalPopovers } : undefined}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameState = () => {
  return useContext(GameContext)!;
};

export const useCurrentPlayer = () => {
  const { state } = useGameState();
  return getCurrentPlayer(state);
};

export const useCurrentHostileNeighbors = () => {
  const { selectedCell } = useSelectedCell();
  const { game, state } = useGameState();
  const currentPlayer = useCurrentPlayer();

  const canAttack = (target: CellState) => {
    return (
      selectedCell &&
      selectedCell.units > 1 &&
      cellsAreNeighbors(selectedCell.position, target.position) &&
      !compareCell(selectedCell.position, target.position) &&
      selectedCell.ownerId !== target.ownerId
    );
  };

  return selectedCell?.isOwnCell && game.phase === "PLAYING"
    ? Object.fromEntries(
        Object.entries(
          getNeighboringCells(selectedCell.position, Object.values(state.cells))
        ).filter(([, targetCell]) => {
          return (
            targetCell.ownerId !== currentPlayer?.id && canAttack(targetCell)
          );
        })
      )
    : null;
};

export const useCurrentUsers = () => {
  const { game } = useGameState();
  return game.players.map((player) => player.user);
};

export const useIsGameFinished = () => {
  const { game } = useGameState();
  return game.phase === "FINISHED";
};

export const useIsSubmitting = () => {
  const transition = useTransition();
  return transition.state !== "idle";
};
