import { Cell } from "@prisma/client";
import { findCell, isCellSelected } from "~/hooks/useComputedGameState";
import { useGrid } from "~/hooks/useGrid";
import { CellState, PlayerState } from "~/domain/logic/game";
import { SVG_SIZE } from "~/grid-math";
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
      className="bg-white max-w-2xl shadow-lg rounded-lg border border-gray-100 mx-4"
      viewBox={`0, 0, ${SVG_SIZE}, ${SVG_SIZE}`}
      fill="currentColor"
      preserveAspectRatio="xMidYMid"
    >
      <g>
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
