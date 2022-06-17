import { defineGrid, Hex, Grid as HoneyGrid, extendHex } from "honeycomb-grid";

export const SVG_SCALE = 36;
export const HEX_RADIUS = 10;
export const HEX_STROKE_WIDTH = 1;

export const HEX_WIDTH = Math.sqrt(3) * HEX_RADIUS;
export const HEX_HEIGHT = 2 * HEX_RADIUS;

export const SVG_SIZE = HEX_RADIUS * SVG_SCALE;
export const SVG_OFFSET_X = SVG_SIZE / 2 - HEX_WIDTH / 2;
export const SVG_OFFSET_Y = SVG_SIZE / 2 - HEX_HEIGHT / 2;

export const GRID_RADIUS = 9;

export type CellType = Hex<{
  size: number;
}>;

export type GridType = HoneyGrid<CellType>;

export const Cell = extendHex({
  size: HEX_RADIUS,
});

export const Grid = defineGrid(Cell);

export const layoutGrid = Grid.hexagon({ radius: GRID_RADIUS });
