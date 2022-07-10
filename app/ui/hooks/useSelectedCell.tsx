import { useState } from "react";
import { CellState, CellStates } from "~/core/actions/types";
import { Point } from "~/core/math";
import { toId } from "~/core/utils";

export const useSelectedCell = (
  availableCells: CellStates,
  hasNextState: boolean
) => {
  const [selectedCellPosition, setSelectedCellPosition] =
    useState<Point | null>();

  const setSelectedCell = (cell: CellState | null, force = false) => {
    if (force || !hasNextState) setSelectedCellPosition(cell?.position);
  };

  if (!selectedCellPosition) return [null, setSelectedCell] as const;
  const selectedCell = availableCells[toId(selectedCellPosition)];

  return [selectedCell, setSelectedCell] as const;
};
