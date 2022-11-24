import type { SupportedCellMode } from "@prisma/client";
import { defineHex, Orientation, type HexCoordinates } from "honeycomb-grid";

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

export type HexCellState = {
  ownerId: string | null;
  index?: number;
  activeModeCode: SupportedCellMode;
  units: number;
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
}

export const compareCell = (c1: HexCell | null, c2: HexCell | null) => {
  if (!c1 && !c2) return false;
  return c1?.q === c2?.q && c1?.r === c2?.r;
};
