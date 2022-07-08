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

export type PlayingState = {
  players: PlayerStates;
  playerIdSequence: string[];
  cells: CellStates;
  actions: Action[];
  turn: number;
};

export type PreparationState = PlayingState & {
  done: boolean;
};

export type Action = {
  name: string;
  payload: any;
  turn: number;
};
