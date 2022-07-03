import { Point } from "honeycomb-grid";
import { randomIntFromInterval } from "~/utils";
import seedrandom from "seedrandom";

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
  assertCurrentPlayer,
  assertPlayerTurn,
} from "./game";
import { cellsAreNeighbors, cellsToPoints } from "./grid";
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

export const attack: ActionFunction<{
  position: Point;
  targetPosition: Point;
  seed: string;
}> = (state, payload) => {
  const { senderId, position, targetPosition, seed } = payload;
  const player = getCurrentPlayer(state, senderId);
  const cell = getCellForPosition(state.cells, position);
  const targetCell = getCellForPosition(state.cells, targetPosition);
  assertNothingPending(state);
  assertCurrentPlayer(state, senderId);
  assertCellAction(state, player, cell);
  assertCellsAreNeighbours(cell, targetCell);

  if (cell.count <= 1) {
    throw new Error("Not enough units to attack");
  }

  let attackerUnits = cell.count - 1;
  let defenderUnits = targetCell.count;

  const attackerUnit = getUnitForId(cell.unitId);
  const defenderUnit = getUnitForId(targetCell.unitId);

  const rng = seedrandom(seed);

  while (attackerUnits > 0 && defenderUnits > 0) {
    const attackerThrow = randomIntFromInterval(rng, 0, attackerUnit.attack);
    const defenderThrow = randomIntFromInterval(rng, 0, defenderUnit.attack);

    if (attackerThrow > defenderThrow) {
      defenderUnits--;
    } else {
      attackerUnits--;
    }
  }

  const cs = updateCell(state.cells, { ...cell, count: 1 });
  const tc = updateCell(cs, {
    ...targetCell,
    count: attackerUnits,
    pendingMovePosition: position,
    unitId: cell.unitId,
  });

  const remainingTargetCellCount = state.cells.filter(
    (c) => c.ownerId === targetCell.ownerId
  ).length;

  const players =
    remainingTargetCellCount === 0
      ? state.players.filter((p) => p.id !== targetCell.ownerId)
      : state.players;

  return {
    ...state,
    players,
    cells: tc,
    actions: [...state.actions, { name: "attack", payload }],
  };
};

export const endTurn: ActionFunction<{}> = (state, payload) => {
  const { senderId } = payload;
  const player = getCurrentPlayer(state, senderId);
  assertCurrentPlayer(state, senderId);
  assertPlayerTurn(state, player);

  const [currentPlayer, ...next] = state.players;
  const players = [...next, currentPlayer];

  return {
    ...state,
    players,
    turn: state.turn + 1,
    cells: state.cells.map((cell) => ({
      ...cell,
      pendingMovePosition: undefined,
    })),
    currentPlayerId: players[0].id,
    actions: [...state.actions, { name: "endTurn", payload }],
  };
};