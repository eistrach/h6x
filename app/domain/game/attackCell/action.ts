import { MaxUnitsToMove } from "./../../../config/rules";
import seedrandom from "seedrandom";
import { CellModes } from "~/config/rules";
import { registerAction } from "~/core/actions";
import { PlayingState } from "~/core/actions/types";
import { isSendersTurn, isPlayerCellOwner } from "~/core/actions/validations";
import { cellsAreNeighbors, Point } from "~/core/math";
import { randomIntFromInterval, toId } from "~/core/utils";
import { getAllCellsForPlayer } from "../utils";

export const throwDice = (rng: seedrandom.PRNG, dice: string) => {
  const [n, d] = dice.toLowerCase().split("d").map(Number);
  return Array(n)
    .fill(d)
    .reduce((acc, curr) => acc + randomIntFromInterval(rng, 0, curr), 0);
};

const attackCellReducer = (
  state: PlayingState,
  payload: {
    senderPlayerId: string;
    source: Point;
    target: Point;
    seed: string;
  }
) => {
  const cell = state.cells[toId(payload.source)];
  const targetCell = state.cells[toId(payload.target)];

  const attackerMode = CellModes[cell.activeModeId];
  const defenderMode = CellModes[targetCell.activeModeId];

  const rng = seedrandom(payload.seed);

  let attackerUnits = cell.units - 1;
  let defenderUnits = targetCell.units;

  // balance big differences between attacker and defender unit counts
  const differenceModifier =
    1 /
    (1 - (attackerUnits - defenderUnits) / (attackerUnits + defenderUnits) / 2);

  console.log("Throw Modifier", differenceModifier);

  while (attackerUnits > 0 && defenderUnits > 0) {
    const attackerThrow =
      throwDice(rng, attackerMode.attackDice) * differenceModifier;
    const defenderThrow = throwDice(rng, defenderMode.defenseDice);

    if (attackerThrow > defenderThrow) {
      defenderUnits--;
    } else {
      attackerUnits--;
    }
  }

  // attacker has lost
  if (attackerUnits < defenderUnits) {
    cell.units = 1;
    targetCell.units = defenderUnits;
    return;
  }

  const targetPlayerId = targetCell.ownerId;

  const unitsToMove = Math.min(attackerUnits, MaxUnitsToMove);
  cell.units = Math.max(attackerUnits - unitsToMove, 0) + 1;
  targetCell.units = unitsToMove;
  targetCell.ownerId = cell.ownerId;
  targetCell.activeModeId = cell.activeModeId;

  const hasTargetLost = !getAllCellsForPlayer(state, targetPlayerId).length;
  if (hasTargetLost)
    state.playerIdSequence = state.playerIdSequence.filter(
      (id) => id !== targetPlayerId
    );
};

export const areCellsHostileNeighbours = (
  state: PlayingState,
  { source, target }: { source: Point; target: Point }
) => {
  const cell = state.cells[toId(source)];
  const targetCell = state.cells[toId(target)];
  if (
    cell.ownerId === targetCell.ownerId &&
    !cellsAreNeighbors(source, target)
  ) {
    throw new Error("Cells are not hostile neighbours");
  }
};

export const hasCellEnoughUnits = (
  state: PlayingState,
  { source }: { source: Point }
) => {
  const cell = state.cells[toId(source)];
  if (cell.units <= 1) {
    throw new Error("Cell has not enough units");
  }
};

export const attackCellAction = registerAction(
  "attackCell",
  [
    isSendersTurn,
    isPlayerCellOwner,
    areCellsHostileNeighbours,
    hasCellEnoughUnits,
  ],
  attackCellReducer
);
