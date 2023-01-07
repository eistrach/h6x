import type { SupportedCellMode } from "@prisma/client";
import {
  defineHex,
  Direction,
  Grid,
  Orientation,
  type HexCoordinates,
} from "honeycomb-grid";

export const HEX_RADIUS = 50;
export const HEX_SPACING = 5;
export const BASE_HEX_STROKE_WIDTH = 4;

export const HEX_HEIGHT = 130;
export const HEX_WIDTH = 125;

export const MAP_RADIUS = 500;
export const VIEWBOX_X = -MAP_RADIUS;
export const VIEWBOX_Y = -MAP_RADIUS;
export const VIEWBOX_WIDTH = MAP_RADIUS * 2;
export const VIEWBOX_HEIGHT = MAP_RADIUS * 2;

export const Directions = [
  Direction.N,
  Direction.NE,
  Direction.SE,
  Direction.S,
  Direction.SW,
  Direction.NW,
];

export type HexCellState = {
  ownerId: string | null;
  index?: number;
  activeModeCode: SupportedCellMode;
  units: number;
  isCurrentPlayersCell: boolean;
};

export class HexCell extends defineHex({
  orientation: Orientation.FLAT,
  dimensions: {
    xRadius: HEX_RADIUS + HEX_SPACING,
    yRadius: HEX_RADIUS + HEX_SPACING,
  },
}) {
  static create(coordinates: HexCoordinates, state: HexCellState) {
    const tile = new HexCell(coordinates);
    tile.state = state;
    return tile;
  }

  state!: HexCellState;

  get coordinates() {
    return { q: this.q, r: this.r };
  }

  get id() {
    return `${this.q},${this.r}`;
  }

  compare(other: HexCell | null) {
    return compareCells(this, other);
  }
}

export class HexGrid extends Grid<HexCell> {
  static fromCells(cells: HexCell[]) {
    return new HexGrid(HexCell, cells);
  }

  neighborsOf(cell: HexCell) {
    return Directions.map((direction) =>
      this.neighborOf(cell, direction, { allowOutside: false })
    ).filter((cell): cell is HexCell => !!cell);
  }

  hostileNeighborsOf(cell: HexCell): HexCell[] {
    return this.neighborsOf(cell).filter((c) =>
      this.areHositleNeighbors(c, cell)
    );
  }

  attackableNeighborsOf(cell: HexCell) {
    return this.hostileNeighborsOf(cell).filter((c) => this.canAttack(cell, c));
  }

  areNeighbors(cell1: HexCell, cell2: HexCell) {
    return this.neighborsOf(cell1).some((c) => c.compare(cell2));
  }

  areHositleNeighbors(cell1: HexCell, cell2: HexCell) {
    return this.hostileNeighborsOf(cell1).some((c) => c.compare(cell2));
  }

  private canAttack(attacker: HexCell, defender: HexCell) {
    if (!attacker.state.isCurrentPlayersCell) return false;
    if (attacker.state.units <= 1) return false;
    if (attacker.state.ownerId === defender.state.ownerId) return false;
    return this.distance(attacker, defender) === 1;
  }
}

export const compareCells = (c1: HexCell | null, c2: HexCell | null) => {
  if (!c1 && !c2) return false;
  return c1?.q === c2?.q && c1?.r === c2?.r;
};
