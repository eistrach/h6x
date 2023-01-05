import PlayerCell from "./PlayerCell";
import {
  HexCell,
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
  VIEWBOX_X,
  VIEWBOX_Y
} from "~/game/game";

const GameMap = () => {
  const cells: HexCell[] = [];

  return (
    <svg
      className=" max-w-2xl shadow-lg  border-4 border-white mx-4  bg-gradient-to-br  from-primary-200/80 to-primary-400/80  rounded-full"
      viewBox={`${VIEWBOX_X}, ${VIEWBOX_Y}, ${VIEWBOX_WIDTH}, ${VIEWBOX_HEIGHT}`}
      fill="currentColor"
      preserveAspectRatio="xMidYMid"
    >
      <g>
        {cells.map((cell) => {
          return <PlayerCell key={cell.id} cell={cell} />;
        })}
      </g>
    </svg>
  );
};

export default GameMap;
