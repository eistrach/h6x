import { HexCell, HexGrid } from "~/game/game";

export const validateCellConnections = (cells: HexCell[]) => {
  const grid = HexGrid.fromCells(cells);
  const queue = [cells[0]];
  const checkedCells: HexCell[] = [];

  while (queue.length > 0) {
    const cell = queue.pop()!;
    if (checkedCells.some((c) => c.compare(cell))) {
      continue;
    }

    checkedCells.push(cell);
    const neighbors = grid.neighborsOf(cell);
    queue.push(...neighbors);
  }

  return checkedCells.length === cells.length;
};
