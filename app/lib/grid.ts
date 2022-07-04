import { Cell } from "@prisma/client";
import {
  defineGrid,
  Hex,
  Grid as HoneyGrid,
  extendHex,
  CompassDirection,
  PointyCompassDirection,
} from "honeycomb-grid";

export const SVG_SCALE = 24;
export const HEX_RADIUS = 8;
export const HEX_STROKE_WIDTH = 1;

export const HEX_WIDTH = Math.sqrt(3) * HEX_RADIUS;
export const HEX_HEIGHT = 2 * HEX_RADIUS;

export const SVG_SIZE = HEX_RADIUS * SVG_SCALE;
export const SVG_OFFSET_X = SVG_SIZE / 2 - HEX_WIDTH / 2;
export const SVG_OFFSET_Y = SVG_SIZE / 2 - HEX_HEIGHT / 2;

export const GRID_RADIUS = 6;

export type MathCell = Hex<{
  size: number;
}>;

export type MathGrid = HoneyGrid<MathCell>;

export const asMathCell = extendHex({
  size: HEX_RADIUS,
});

export const asMathGrid = defineGrid(asMathCell);

export const layoutGrid = asMathGrid.hexagon({ radius: GRID_RADIUS });

export const cellCorners = asMathCell().corners();

export function compareCell(c1: Point, c2: Point) {
  return c1.x === c2.x && c1.y === c2.y;
}

export function cellInGrid(cell: Point, grid: Point[]) {
  return !!grid.find((c) => compareCell(c, cell));
}

export const getAllCellsInArea = (
  cell: Point,
  cells: Omit<Cell, "id">[],
  fill: boolean = false
) => {
  const gridCells = cells.map((cell) => asMathCell(cell.x, cell.y));

  const startingCell = asMathCell(cell.x, cell.y);

  const queue = [startingCell];

  const checkedCells = [] as MathCell[];

  while (queue.length > 0) {
    const cell = queue.pop()!;
    if (cellInGrid(cell, checkedCells)) {
      continue;
    }

    checkedCells.push(cell);
    const neighbors = !fill
      ? layoutGrid
          .neighborsOf(cell)
          .filter((c) => !!c && cellInGrid(c, gridCells))
      : layoutGrid
          .neighborsOf(cell)
          .filter((c) => !!c && !cellInGrid(c, gridCells));
    queue.push(...neighbors);
  }

  return checkedCells;
};

export const cellsToMathCells = (cells: Omit<Cell, "id">[]) => {
  return cells.map((cell) => asMathCell(cell.x, cell.y));
};

export const cellsToPoints = (cells: Omit<Cell, "id">[]) => {
  return cells.map(cellToPoint);
};

export const cellToPoint = (cell: Omit<Cell, "id">) => {
  return {
    x: cell.x,
    y: cell.y,
  };
};

export const cellsAreNeighbors = (c1: Point, c2: Point) => {
  return layoutGrid
    .neighborsOf(asMathCell(c1.x, c1.y))
    .some((c) => compareCell(c, c2));
};

export const getNeighboringCells = <
  T extends { position: { x: number; y: number } }
>(
  cell: Point,
  cells: T[]
): { [key in PointyCompassDirection]: T } => {
  const directions = [
    "E",
    "SE",
    "SW",
    "W",
    "NE",
    "NW",
  ] as PointyCompassDirection[];

  const cs = layoutGrid
    .neighborsOf(asMathCell(cell.x, cell.y), directions)
    .map(
      (c, i) =>
        [
          directions[i],
          cells.find((c2) => compareCell(c, c2.position))!,
        ] as const
    )
    .filter(([, c]) => !!c);
  return Object.fromEntries(new Map(cs)) as unknown as {
    [key in PointyCompassDirection]: T;
  };
};

export type Point = { x: number; y: number };
