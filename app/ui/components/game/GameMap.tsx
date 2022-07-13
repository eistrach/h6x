import { useGrid } from "~/ui/hooks/useGrid";
import {
  compareCell,
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
  VIEWBOX_X,
  VIEWBOX_Y,
} from "~/core/math";
import PlayerCell from "./PlayerCell";
import { toId } from "~/core/utils";
import { useGameState } from "~/ui/context/GameContext";

const GameMap = () => {
  const { state, nextState } = useGameState();
  const grid = useGrid(Object.values(state.cells));

  const backCells = grid.filter(
    (cell) =>
      nextState?.causedBy?.payload &&
      "source" in nextState.causedBy.payload &&
      !compareCell(cell, nextState.causedBy.payload.source)
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
        {[...backCells, ...frontCells].map((position) => {
          return <PlayerCell key={toId(position)} position={position} />;
        })}
      </g>
    </svg>
  );
};

export default GameMap;
