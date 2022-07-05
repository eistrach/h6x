import { GState } from "~/domain/game.server";
import { PLAYER_COLORS } from "~/lib/constants";
import { CellState } from "~/lib/game";
import {
  cellsAreNeighbors,
  compareCell,
  getNeighboringCells,
  Point,
} from "~/lib/grid";
import { getUnitForId } from "~/config/units";

export const canAttack = (
  playerId: string,
  source: CellState | undefined,
  target: CellState
) => {
  return (
    source?.ownerId === playerId &&
    source.count > 1 &&
    cellsAreNeighbors(source.position, target.position) &&
    !compareCell(source.position, target.position) &&
    source.ownerId !== target.ownerId
  );
};

export const findCell = (cells: CellState[], cell: Point) => {
  return cells.find((c) => compareCell(c.position, cell))!;
};

export const isCellSelected = (
  selectedCell: CellState | undefined,
  cell: CellState | Point
) => {
  const position = "position" in cell ? cell.position : cell;
  return selectedCell && compareCell(position, selectedCell.position);
};

export const useComputedGameState = (
  state: GState,
  selectedCell: CellState | undefined
) => {
  const { playerCells, players, canTakeAction, playerId, phase } = state;

  const currentPlayer = players.find((p) => p.id === playerId)!;
  const canUseBuyActions = selectedCell?.ownerId === currentPlayer.id;
  const selectedUnit = selectedCell && getUnitForId(selectedCell.unitId);

  const attackableNeighbors =
    canTakeAction &&
    phase === "PLAYING" &&
    selectedCell &&
    selectedCell.ownerId === currentPlayer.id
      ? Object.fromEntries(
          Object.entries(
            getNeighboringCells(selectedCell.position, playerCells)
          ).filter(
            ([, c]) =>
              c.ownerId !== currentPlayer.id &&
              canAttack(playerId, selectedCell, c)
          )
        )
      : {};

  return {
    attackableNeighbors,
    currentPlayer,
    canUseBuyActions,
    selectedUnit,
  };
};
