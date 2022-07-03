import { Form, useFetcher } from "@remix-run/react";
import clsx from "clsx";
import { NEUTRAL_COLOR, PLAYER_COLORS } from "~/lib/constants";
import { CellState, PlayerState } from "~/lib/game";
import {
  MathCell,
  HEX_STROKE_WIDTH,
  SVG_OFFSET_X,
  SVG_OFFSET_Y,
  cellCorners,
  HEX_HEIGHT,
  HEX_WIDTH,
  SVG_SCALE,
} from "~/lib/grid";
import { getUnitForId } from "~/lib/units";

type PlayerCellProps = {
  cell: MathCell;
  playerCell: CellState;
  players: PlayerState[];
  onClick: (cell: CellState, player: PlayerState) => void;
  selected: boolean;
};

export default function PlayerCell({
  cell,
  playerCell,
  players,
  onClick,
  selected,
}: PlayerCellProps) {
  const { x, y } = cell.toPoint();

  const player = players.find((p) => p.id === playerCell.ownerId)!;
  const color = (player && PLAYER_COLORS[player.index]) || NEUTRAL_COLOR;

  return (
    <g
      onClick={() => onClick(playerCell, player)}
      transform={`translate(${x + SVG_OFFSET_X}, ${y + SVG_OFFSET_Y})`}
      className={clsx("stroke-black", color.fill, {
        "fill-gray-300 ": selected,
      })}
    >
      <polygon
        strokeWidth={selected ? HEX_STROKE_WIDTH : HEX_STROKE_WIDTH}
        points={cellCorners
          .map((corner) => `${corner.x},${corner.y}`)
          .join(" ")}
      />

      <text
        transform={`translate(${HEX_WIDTH / 2}, ${HEX_HEIGHT / 2 + 0.5})`}
        dominantBaseline="middle"
        textAnchor="middle"
        className="fill-black stroke-black"
        fontSize="5"
        strokeWidth=".3"
      >
        {playerCell.count}/{getUnitForId(playerCell.unitId).name[0]}
      </text>
    </g>
  );
}
