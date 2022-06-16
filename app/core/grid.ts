import { defineGrid, Hex, Grid, extendHex } from "honeycomb-grid";

export type CellType = Hex<{
  size: number;
}>;

export type MapType = Grid<CellType>;

export const Cell = extendHex({
  size: 5,
});

export const Map = defineGrid(Cell);
