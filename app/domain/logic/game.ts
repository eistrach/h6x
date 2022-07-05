import { cellsAreNeighbors, compareCell, Point } from "~/grid-math";
import { UnitId } from "../../config/units";

export type PlayerState = {
  id: string;
  userId: string;
  money: number;
  index: number;
};

export type CellState = {
  ownerId: string;
  unitId: UnitId;
  count: number;
  position: Point;
  pendingMovePosition?: Point;
};

export type GameState = {
  currentPlayerId: string;
  players: PlayerState[];
  cells: CellState[];
  actions: Action[];
};

export type PlayingState = GameState & {
  turn: number;
};

export type SetupState = GameState & {
  done: boolean;
};

export type Action = {
  name: string;
  payload: any;
};

export type ActionFunction<T extends any> = (
  state: PlayingState,
  payload: T & { senderId: string }
) => PlayingState;

export type SetupActionFunction<T extends any> = (
  state: SetupState,
  payload: T & { senderId: string }
) => SetupState;

export const assertPlayerIsSender = (player: PlayerState, senderId: string) => {
  if (player.id !== senderId) {
    throw new Error("Player is not the sender");
  }
};

export const assertCurrentPlayer = (state: PlayingState, senderId: string) => {
  if (state.currentPlayerId !== senderId) {
    throw new Error("It is not the current player's turn");
  }
};

export const assertNothingPending = (state: PlayingState) => {
  if (state.cells.some((cell) => !!cell.pendingMovePosition)) {
    throw new Error("There is a pending move");
  }
};

export const assertCellAction = (
  state: PlayingState,
  player: PlayerState,
  cell: CellState
) => {
  assertPlayerTurn(state, player);
  assertPlayerCell(player, cell);
};

export const assertPlayerHasMoney = (player: PlayerState, amount: number) => {
  if (player.money < amount) {
    throw new Error("Not enough money");
  }
};

export const assertPlayerTurn = (state: PlayingState, player: PlayerState) => {
  if (state.currentPlayerId !== player.id) {
    throw new Error("Not your turn");
  }
};

export const assertPlayerCell = (player: PlayerState, cell: CellState) => {
  if (cell.ownerId !== player.id) {
    throw new Error("Cell is not yours");
  }
};

export const assertUnitNotEqual = (unitId: string, cellUnitId: string) => {
  if (unitId === cellUnitId) {
    throw new Error("Unit is the same");
  }
};

export const assertCellsAreNeighbours = (c1: CellState, c2: CellState) => {
  if (!cellsAreNeighbors(c1.position, c2.position)) {
    throw new Error("Cells are not neighbours");
  }
};

export const getPlayerForId = (state: GameState, id: string) => {
  return state.players.find((player) => player.id === id)!;
};

export const getCurrentPlayer = (
  state: PlayingState,
  senderId: string
): PlayerState => {
  assertCurrentPlayer(state, senderId);
  return state.players.find((player) => player.id === state.currentPlayerId)!;
};

export const getCellForPosition = (
  cells: CellState[],
  position: Point
): CellState => {
  return cells.find((cell) => compareCell(cell.position, position))!;
};

export const updatePlayer = (
  state: GameState,
  player: PlayerState
): PlayerState[] => {
  return state.players.map((p) => {
    if (p.id === player.id) {
      return player;
    }
    return p;
  });
};

export const updateCell = (
  cells: CellState[],
  cell: CellState
): CellState[] => {
  return cells.map((c) => {
    if (compareCell(c.position, cell.position)) {
      return cell;
    }
    return c;
  });
};
