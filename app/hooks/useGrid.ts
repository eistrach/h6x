import { CellState } from "~/lib/game";
import { asMathCell, asMathGrid } from "~/lib/grid";

export const useGrid = (cells: CellState[]) => {
  return asMathGrid(cells.map((c) => asMathCell(c.position.x, c.position.y)));
};
