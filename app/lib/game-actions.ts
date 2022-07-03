import { Point } from "honeycomb-grid";
import {
  assertNothingPending,
  getCurrentPlayer,
  getCellForPosition,
  assertPlayerHasMoney,
  updatePlayer,
  updateCell,
  ActionFunction,
  assertUnitNotEqual,
  assertCellAction,
  assertCellsAreNeighbours,
} from "./game";
import { getUnitForId } from "./units";

export const buyUnit: ActionFunction<{
  unitId: string;
  position: Point;
}> = (state, payload) => {
  const { senderId, unitId, position } = payload;
  const player = getCurrentPlayer(state, senderId);
  const cell = getCellForPosition(state.cells, position);
  const unit = getUnitForId(unitId);
  assertNothingPending(state);
  assertCellAction(state, player, cell);
  assertPlayerHasMoney(player, unit.cost);
  assertUnitNotEqual(unitId, cell.unitId);

  const waste = cell.count - unit.limit;
  const count = waste > 0 ? cell.count - waste : cell.count;

  return {
    ...state,
    players: updatePlayer(state, {
      ...player,
      money: player.money - unit.cost,
    }),
    cells: updateCell(state.cells, {
      ...cell,
      unitId,
      count,
    }),
    actions: [...state.actions, { name: "buyUnit", payload }],
  };
};

export const moveUnit: ActionFunction<{
  position: Point;
  unitsToMove: number;
}> = (state, payload) => {
  const { senderId, position, unitsToMove } = payload;
  const player = getCurrentPlayer(state, senderId);
  const cell = getCellForPosition(state.cells, position);
  assertCellAction(state, player, cell);

  if (!cell.pendingMovePosition) {
    throw new Error("There is no pending move");
  }

  if (cell.count <= unitsToMove) {
    throw new Error("Not enough units");
  }

  const targetCell = getCellForPosition(state.cells, cell.pendingMovePosition);

  assertCellsAreNeighbours(cell, targetCell);

  const cs = updateCell(state.cells, {
    ...targetCell,
    count: targetCell.count + unitsToMove,
  });

  const cells = updateCell(cs, {
    ...cell,
    count: cell.count - unitsToMove,
    pendingMovePosition: undefined,
  });

  return {
    ...state,
    cells,
    actions: [...state.actions, { name: "moveUnit", payload }],
  };
};

const upgradeCell: ActionFunction<{ position: Point }> = (state, payload) => {
  const { senderId, position } = payload;
  const player = getCurrentPlayer(state, senderId);
  const cell = getCellForPosition(state.cells, position);
  const unit = getUnitForId(cell.unitId);
  assertNothingPending(state);
  assertCellAction(state, player, cell);
  assertPlayerHasMoney(player, unit.cost);

  if (cell.count >= unit.limit) {
    throw new Error("Cell is already at maximum level");
  }

  return {
    ...state,
    players: updatePlayer(state, {
      ...player,
      money: player.money - unit.cost,
    }),
    cells: updateCell(state.cells, {
      ...cell,
      count: cell.count + 1,
    }),
    actions: [...state.actions, { name: "upgradeCell", payload }],
  };
};


