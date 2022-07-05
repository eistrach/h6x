import { CellState } from "~/domain/logic/game";
import { asMathCell, asMathGrid } from "~/grid-math";

export const useGrid = (cells: CellState[]) => {
  return asMathGrid(cells.map((c) => asMathCell(c.position.x, c.position.y)));
};
