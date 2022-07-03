import { layoutGrid } from "./grid";
import { DEFAULT_NEUTRAL_UNIT_ID, START_MONEY } from "./constants";
import { Cell, Player } from "@prisma/client";
import { Point } from "honeycomb-grid";
import { v4 as uuid } from "uuid";
import {
  getCellForPosition,
  assertPlayerHasMoney,
  assertUnitNotEqual,
  updateCell,
  SetupActionFunction,
  assertPlayerIsSender,
  SetupState,
  assertPlayerCell,
  CellState,
  PlayerState,
} from "./game";
import { getUnitForId } from "./units";

const assertSetupNotFinished = (state: SetupState) => {
  if (state.done) {
    throw new Error("Setup is finished");
  }
};

export const buyUnitDuringSetup: SetupActionFunction<{
  unitId: string;
  position: Point;
}> = (state, payload) => {
  const { senderId, unitId, position } = payload;
  const player = state.player;
  const cell = getCellForPosition(state.cells, position);
  const unit = getUnitForId(unitId);
  assertSetupNotFinished(state);
  assertPlayerIsSender(player, senderId);
  assertPlayerCell(player, cell);
  assertPlayerHasMoney(player, unit.cost);
  assertUnitNotEqual(unitId, cell.unitId);

  const waste = cell.count - unit.limit;
  const count = waste > 0 ? cell.count - waste : cell.count;

  return {
    ...state,
    player: {
      ...player,
      money: player.money - unit.cost,
    },
    cells: updateCell(state.cells, {
      ...cell,
      unitId,
      count,
    }),
    actions: [...state.actions, { name: "buyUnit", payload }],
  };
};

export const upgradeCellDuringSetup: SetupActionFunction<{
  position: Point;
}> = (state, payload) => {
  const { senderId, position } = payload;
  const player = state.player;
  const cell = getCellForPosition(state.cells, position);
  const unit = getUnitForId(cell.unitId);
  assertSetupNotFinished(state);
  assertPlayerIsSender(player, senderId);
  assertPlayerCell(player, cell);
  assertPlayerHasMoney(player, unit.cost);

  if (cell.count >= unit.limit) {
    throw new Error("Cell is already at maximum level");
  }

  return {
    ...state,
    players: {
      ...player,
      money: player.money - unit.cost,
    },
    cells: updateCell(state.cells, {
      ...cell,
      count: cell.count + 1,
    }),
    actions: [...state.actions, { name: "upgradeCell", payload }],
  };
};

export const endSetupTurn: SetupActionFunction<{}> = (state, payload) => {
  const { senderId } = payload;
  const player = state.player;
  assertSetupNotFinished(state);
  assertPlayerIsSender(player, senderId);

  return {
    ...state,
    done: true,
    actions: [...state.actions, { name: "endTurn", payload }],
  };
};

export const initializePlayers = (players: Player[]) => {
  return players.map((player) => ({
    id: player.id,
    userId: player.userId,
    money: START_MONEY,
  }));
};

export const initializeCells = (players: PlayerState[], mapCells: Cell[]) => {
  const availableCells = mapCells
    .filter((cell) => cell.type === "PLAYER")
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  const playerCellCount = Math.floor(availableCells.length / players.length);

  const cells = players.flatMap((player) => {
    const cells = availableCells.splice(0, playerCellCount);
    return cells.map((cell) => {
      return {
        position: { x: cell.x, y: cell.y },
        unitId: DEFAULT_NEUTRAL_UNIT_ID,
        count: 1,
        ownerId: player.id,
      };
    });
  });

  const neutralCells = availableCells.map((cell) => {
    return {
      position: { x: cell.x, y: cell.y },
      unitId: DEFAULT_NEUTRAL_UNIT_ID,
      count: 3,
      ownerId: "neutral",
    };
  });

  return [...cells, ...neutralCells];
};

export const initializeSetup = (player: PlayerState, cells: CellState[]) => {
  return {
    player,
    cells,
    actions: [],
    done: false,
  };
};

export const initializeGame = (setup: SetupState[], cells: CellState[]) => {
  const players = setup
    .map((value) => ({ value: value.player, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  return {
    players,
    cells,
    actions: setup.flatMap((s) => s.actions),
    currentPlayerId: players[0].id,
  };
};
