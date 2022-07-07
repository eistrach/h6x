import { findCell, isCellSelected } from "~/hooks/useComputedGameState";
import { useGrid } from "~/hooks/useGrid";
import { CellState, PlayerState } from "~/domain/logic/game";
import {
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
  VIEWBOX_X,
  VIEWBOX_Y,
} from "~/grid-math";
import {
  AttackableNeighbors,
  DirectionalPopovers,
  getAttackPopoverRef,
} from "./AttackPopovers";
import PlayerCell from "./PlayerCell";

type GameMapProps = {
  selectedCell?: CellState;
  cells: CellState[];
  onClick: (cell: CellState) => void;
  directionalPopovers: DirectionalPopovers;
  attackableNeighbors: AttackableNeighbors;
  currentPlayer: PlayerState;
  players: PlayerState[];
};

const GameMap = ({
  selectedCell,
  cells,
  onClick,
  directionalPopovers,
  attackableNeighbors,
  players,
}: GameMapProps) => {
  const grid = useGrid(cells);
  return (
    <svg
      className=" max-w-2xl shadow-lg  border-4 border-white mx-4  bg-gradient-to-br  from-primary-200/80 to-primary-400/80  rounded-full"
      viewBox={`${VIEWBOX_X}, ${VIEWBOX_Y}, ${VIEWBOX_WIDTH}, ${VIEWBOX_HEIGHT}`}
      fill="currentColor"
      preserveAspectRatio="xMidYMid"
    >
      <g>
        <circle cx={0} cy={0} r={40} />
        {grid.map((cell) => {
          const playerCell = findCell(cells, cell);
          const isSelected = isCellSelected(selectedCell, cell);
          const popperRef = getAttackPopoverRef(
            cell,
            directionalPopovers,
            attackableNeighbors
          );
          return (
            <PlayerCell
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
