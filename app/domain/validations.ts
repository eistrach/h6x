import { Cell } from "@prisma/client";
import { asMathCell, cellInGrid, MathCell, asMathGrid } from "~/core/math";

export const validateCellConnections = (cells: Omit<Cell, "id">[]) => {
  const gridCells = cells.map((cell) => asMathCell(cell.x, cell.y));
  const grid = asMathGrid(gridCells);
  const queue = [grid[0]];
  const checkedCells = [] as MathCell[];

  while (queue.length > 0) {
    const cell = queue.pop()!;
    if (cellInGrid(cell, checkedCells)) {
      continue;
    }

    checkedCells.push(cell);
    const neighbors = grid.neighborsOf(cell).filter((c) => !!c);
    queue.push(...neighbors);
  }

  return checkedCells.length === gridCells.length;
};
