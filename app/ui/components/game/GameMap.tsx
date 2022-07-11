import { findCell, isCellSelected } from "~/ui/hooks/useComputedGameState";
import { useGrid } from "~/ui/hooks/useGrid";
import {
  CellState,
  CellStates,
  PlayerState,
  PlayerStates,
  PlayingState,
} from "~/core/actions/types";
import {
  compareCell,
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
  VIEWBOX_X,
  VIEWBOX_Y,
} from "~/core/math";
import {
  AttackableNeighbors,
  DirectionalPopovers,
  getAttackPopoverRef,
} from "./AttackPopovers";
import PlayerCell from "./PlayerCell";
import { toId } from "~/core/utils";

type GameMapProps = {
  selectedCell: CellState | null;
  cells: CellStates;
  onClick: (cell: CellState) => void;
  directionalPopovers: DirectionalPopovers;
  attackableNeighbors: AttackableNeighbors;
  currentPlayer: PlayerState;
  state: PlayingState;
  nextState?: PlayingState;
  players: PlayerStates;
  isTransitioning: boolean;
};

const GameMap = ({
  selectedCell,
  cells,
  onClick,
  directionalPopovers,
  attackableNeighbors,
  state,
  nextState,
  players,
  isTransitioning,
}: GameMapProps) => {
  const grid = useGrid(Object.values(cells));

  const backCells = grid.filter(
    (cell) =>
      state?.causedBy?.payload &&
      "source" in state.causedBy.payload &&
      !compareCell(cell, state.causedBy.payload.source)
  );

  const frontCells = grid.filter(
    (cell) => !backCells.find((c2) => compareCell(c2, cell))
  );

  return (
    <svg
      className=" max-w-2xl shadow-lg  border-4 border-white mx-4  bg-gradient-to-br  from-primary-200/80 to-primary-400/80  rounded-full"
      viewBox={`${VIEWBOX_X}, ${VIEWBOX_Y}, ${VIEWBOX_WIDTH}, ${VIEWBOX_HEIGHT}`}
      fill="currentColor"
      preserveAspectRatio="xMidYMid"
    >
      <g>
        {[...backCells, ...frontCells].map((cell) => {
          const playerCell = cells[toId(cell)];
          const isSelected = isCellSelected(selectedCell, cell);
          const popperRef = getAttackPopoverRef(
            cell,
            directionalPopovers,
            attackableNeighbors
          );
          return (
            <PlayerCell
              state={state}
              isTransitioning={isTransitioning}
              nextState={nextState}
              popperRef={popperRef}
              selected={!!isSelected}
              onClick={onClick}
              key={cell.toString()}
              cell={cell}
              playerCell={playerCell}
              players={players}
            />
          );
        })}
      </g>
    </svg>
  );
};

export default GameMap;
