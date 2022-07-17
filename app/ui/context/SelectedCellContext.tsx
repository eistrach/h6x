import { createContext, PropsWithChildren, useContext, useState } from "react";
import { CellModes } from "~/config/rules";
import { CellState } from "~/core/actions/types";
import { Point } from "~/core/math";
import { toId, useUser } from "~/core/utils";
import { useCurrentPlayer, useGameState } from "./GameContext";

export const SelectedCellContext = createContext<{
  selectedCell: CellState | null;
  setSelectedCell: (cell: CellState | null, force?: boolean) => void;
}>({ selectedCell: null, setSelectedCell: () => {} });

export const SelectedCellProvider = ({ children }: PropsWithChildren<{}>) => {
  const {
    nextState,
    state: { cells },
  } = useGameState();
  const [selectedCellPosition, setSelectedCellPosition] =
    useState<Point | null>();

  const setSelectedCell = (cell: CellState | null, force = false) => {
    if (force || !nextState) setSelectedCellPosition(cell?.position);
  };

  if (!selectedCellPosition)
    return (
      <SelectedCellContext.Provider
        value={{ selectedCell: null, setSelectedCell }}
      >
        {children}
      </SelectedCellContext.Provider>
    );
  const selectedCell = cells[toId(selectedCellPosition)];

  return (
    <SelectedCellContext.Provider value={{ selectedCell, setSelectedCell }}>
      {children}
    </SelectedCellContext.Provider>
  );
};

export const useSelectedCell = () => {
  const ctx = useContext(SelectedCellContext)!;
  const currentPlayer = useCurrentPlayer();
  const user = useUser();

  return {
    ...ctx,
    selectedCell: ctx.selectedCell && {
      ...ctx.selectedCell,
      mode: CellModes[ctx.selectedCell.activeModeId],
      isOwnCell:
        ctx.selectedCell.ownerId === currentPlayer?.id &&
        currentPlayer?.userId === user.id,
    },
  };
};
