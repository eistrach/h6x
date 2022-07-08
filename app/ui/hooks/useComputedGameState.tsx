import { GameWithState } from "~/domain/game/game.server";

import { CellState } from "~/core/actions/types";
import { getAllCellsForPlayer, getCurrentPlayer } from "~/domain/game/utils";
import {
  cellsAreNeighbors,
  compareCell,
  getNeighboringCells,
  Point,
} from "~/core/math";
import { CellModes } from "~/config/rules";

export const canAttack = (
  playerId: string,
  source: CellState | undefined,
  target: CellState
) => {
  return (
    source?.ownerId === playerId &&
    source.units > 1 &&
    cellsAreNeighbors(source.position, target.position) &&
    !compareCell(source.position, target.position) &&
    source.ownerId !== target.ownerId
  );
};

export const findCell = (cells: CellState[], cell: Point) => {
  return cells.find((c) => compareCell(c.position, cell))!;
};

export const isCellSelected = (
  selectedCell: CellState | null,
  cell: CellState | Point
) => {
  const position = "position" in cell ? cell.position : cell;
  return selectedCell && compareCell(position, selectedCell.position);
};

export const useComputedGameState = (
  gameWithState: GameWithState,
  selectedCell: CellState | undefined | null
) => {
  const { game, state, canTakeAction } = gameWithState;

  const currentPlayer = getCurrentPlayer(state);
  const canUseBuyActions = selectedCell?.ownerId === currentPlayer.id;
  const selectedUnit = selectedCell && CellModes[selectedCell.activeModeId];

  const attackableNeighbors =
    canTakeAction &&
    game.phase === "PLAYING" &&
    selectedCell &&
    selectedCell.ownerId === currentPlayer.id
      ? Object.fromEntries(
          Object.entries(
            getNeighboringCells(
              selectedCell.position,
              Object.values(state.cells)
            )
          ).filter(([, c]) => {
            return (
              c.ownerId !== currentPlayer.id &&
              canAttack(currentPlayer.id, selectedCell, c)
            );
          })
        )
      : {};

  return {
    attackableNeighbors,
    currentPlayer,
    canUseBuyActions,
    selectedUnit,
  };
};
