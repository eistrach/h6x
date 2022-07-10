export const MinDiamondsPerTurn = 5;
export const UnitCost = 1;
export const ModeChangesPerTurn = 3;
export const MaxUnitsToMove = 5;

export const DefaultPlayerModeId: CellModeId = "average";
export const DefaultNeutralModeId: CellModeId = "defensive";

export const CellModes = {
  average: {
    attackDice: "1d6",
    defenseDice: "1d8",
    diamondsPerTurn: 1,
  },

  offensive: {
    attackDice: "2d6",
    defenseDice: "1d3",
    diamondsPerTurn: 1,
  },

  defensive: {
    attackDice: "1d3",
    defenseDice: "2d7",
    diamondsPerTurn: 1,
  },

  productive: {
    attackDice: "1d3",
    defenseDice: "1d6",
    diamondsPerTurn: 2,
  },
};

export type CellMode = typeof CellModes;
export type CellModeId = keyof typeof CellModes;

export const CellModeIds = [
  "average",
  "offensive",
  "defensive",
  "productive",
] as const;
