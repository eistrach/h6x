import { useState } from "react";
import { CellState } from "~/domain/logic/game";
import { compareCell, Point } from "~/grid-math";

export const useSelectedCell = (availableCells: CellState[]) => {
  const [selectedCellPosition, setSelectedCellPosition] =
    useState<Point | null>();
  const selectedCell = availableCells.find(
    (c) => selectedCellPosition && compareCell(c.position, selectedCellPosition)
  );

  const setSelectedCell = (cell?: CellState) => {
    setSelectedCellPosition(cell?.position);
  };

  return [selectedCell, setSelectedCell] as const;
};
