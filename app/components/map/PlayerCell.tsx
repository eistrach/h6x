import clsx from "clsx";
import { NEUTRAL_COLOR, PLAYER_COLORS } from "~/lib/constants";
import { CellState, PlayerState } from "~/lib/game";
import {
  MathCell,
  HEX_STROKE_WIDTH,
  SVG_OFFSET_X,
  SVG_OFFSET_Y,
  cellCorners,
} from "~/lib/grid";

type PlayerCellProps = {
  cell: MathCell;
  playerCell: CellState;
  players: PlayerState[];
};

export default function PlayerCell({
  cell,
  playerCell,
  players,
}: PlayerCellProps) {
  const { x, y } = cell.toPoint();

  const player = players.find((p) => p.id === playerCell.ownerId)!;
  const color = (player && PLAYER_COLORS[player.index]) || NEUTRAL_COLOR;

  return (
    <g
      transform={`translate(${x + SVG_OFFSET_X}, ${y + SVG_OFFSET_Y})`}
      className={clsx("stroke-black", color.fill)}
    >
      <polygon
        strokeWidth={HEX_STROKE_WIDTH}
        points={cellCorners
          .map((corner) => `${corner.x},${corner.y}`)
          .join(" ")}
      />
    </g>
  );
}
