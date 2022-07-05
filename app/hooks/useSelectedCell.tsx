import { useState } from "react";
import { CellState } from "~/lib/game";
import { compareCell, Point } from "~/lib/grid";

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
