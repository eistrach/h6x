import { CellModeId } from "../../config/rules";
import { Point } from "../math";

export type PlayerState = {
  id: string;
  userId: string;
  diamonds: number;
  availableModeChanges: number;
  index: number;
};

export type PlayerStates = { [id: string]: PlayerState };

export type CellState = {
  ownerId: string;
  activeModeId: CellModeId;
  units: number;
  position: Point;
};

export type CellStates = { [id: string]: CellState };

export type PlayingState<P = any> = {
  players: PlayerStates;
  playerIdSequence: string[];
  cells: CellStates;
  causedBy: Action<P>;
  turn: number;
  done?: boolean;
};

export type PreparationState<P = any> = PlayingState<P> & {
  done: boolean;
};

export type Action<P extends any = any> = {
  name: string;
  payload: P;
  turn: number;
};
