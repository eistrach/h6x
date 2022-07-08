import { CellState } from "~/core/actions/types";
import { asMathCell, asMathGrid } from "~/core/math";

export const useGrid = (cells: CellState[]) => {
  return asMathGrid(cells.map((c) => asMathCell(c.position.x, c.position.y)));
};
