import {
  defineGrid,
  Hex,
  Grid as HoneyGrid,
  extendHex,
  FlatCompassDirection,
} from "honeycomb-grid";
import { Cell } from "~/domain/map.server";

export const HEX_RADIUS = 50;
export const HEX_SPACING = 5;
export const HEX_STROKE_WIDTH = 4;

// from svg viewbox of the cell
export const HEX_HEIGHT = 130;
export const HEX_WIDTH = 125;

export const MAP_RADIUS = 500;
export const VIEWBOX_X = -MAP_RADIUS;
export const VIEWBOX_Y = -MAP_RADIUS;
export const VIEWBOX_WIDTH = MAP_RADIUS * 2;
export const VIEWBOX_HEIGHT = MAP_RADIUS * 2;

export const GRID_RADIUS = 5;

export type MathCell = Hex<{
  size: number;
}>;

export type MathGrid = HoneyGrid<MathCell>;

export const asMathCell = extendHex({
  size: HEX_RADIUS + HEX_SPACING,
  orientation: "flat",
});

export const editorCell = extendHex({
  size: 40,
  orientation: "flat",
});

export const editorGrid = defineGrid(editorCell);

export const asMathGrid = defineGrid(asMathCell);

export const layoutCells = asMathGrid.hexagon({
  radius: GRID_RADIUS,
});

export const editorCells = editorGrid.hexagon({
  radius: GRID_RADIUS,
});

export const cellCorners = editorCell().corners();

export function compareCell(
  c1: Point | null | undefined,
  c2?: Point | null | undefined
) {
  if (!c1 && !c2) return true;
  if (!c1 || !c2) return false;
  return c1.x === c2.x && c1.y === c2.y;
}

export function cellInGrid(cell: Point, grid: Point[]) {
  return !!grid.find((c) => compareCell(c, cell));
}

export const getAllCellsInArea = (
  cell: Point,
  cells: Cell[],
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
      ? layoutCells
          .neighborsOf(cell)
          .filter((c) => !!c && cellInGrid(c, gridCells))
      : layoutCells
          .neighborsOf(cell)
          .filter((c) => !!c && !cellInGrid(c, gridCells));
    queue.push(...neighbors);
  }

  return checkedCells;
};

export const cellsToMathCells = (cells: Cell[]) => {
  return cells.map((cell) => asMathCell(cell.x, cell.y));
};

export const cellsToPoints = (cells: Cell[]) => {
  return cells.map(cellToPoint);
};

export const cellToPoint = (cell: Cell) => {
  return {
    x: cell.x,
    y: cell.y,
  };
};

export const cellsAreNeighbors = (c1: Point, c2: Point) => {
  return layoutCells
    .neighborsOf(asMathCell(c1.x, c1.y))
    .some((c) => compareCell(c, c2));
};

export const getNeighboringCells = <
  T extends { position: { x: number; y: number } }
>(
  cell: Point,
  cells: T[]
): { [key in CompassDirection]: T } => {
  const directions: CompassDirection[] = [
    "S",
    "SW",
    "SE",
    "N",
    "NE",
    "NW",
  ] as any;

  const cs = layoutCells
    .neighborsOf(asMathCell(cell.x, cell.y), directions)
    .filter((c) => !!c)
    .map(
      (c, i) =>
        [
          directions[i],
          cells.find((c2) => compareCell(c, c2.position))!,
        ] as const
    )
    .filter(([, c]) => !!c);
  return Object.fromEntries(new Map(cs)) as unknown as {
    [key in CompassDirection]: T;
  };
};

export type CompassDirection = FlatCompassDirection;
export type Point = { x: number; y: number };
