import { Cell } from "@prisma/client";
import { asMathCell, asMathGrid, MathCell } from "~/lib/grid";

export const validateCellConnections = (cells: Omit<Cell, "id">[]) => {
  const gridCells = cells.map((cell) => asMathCell(cell.x, cell.y));
  const grid = asMathGrid(gridCells);
  const queue = [grid[0]];
  const checkedCells = [] as MathCell[];

  while (queue.length > 0) {
    const cell = queue.pop()!;
    if (checkedCells.find((c) => c.x === cell.x && c.y === cell.y)) {
      continue;
    }

    checkedCells.push(cell);
    const neighbors = grid.neighborsOf(cell).filter((c) => !!c);
    queue.push(...neighbors);
  }

  return checkedCells.length === gridCells.length;
};
