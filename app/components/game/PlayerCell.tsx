import clsx from "clsx";
import { NEUTRAL_COLOR, PLAYER_COLORS } from "~/config/config";
import { CellState, PlayerState } from "~/domain/logic/game";
import {
  MathCell,
  SVG_OFFSET_X,
  SVG_OFFSET_Y,
  HEX_HEIGHT,
  HEX_WIDTH,
} from "~/grid-math";
import { getUnitForId } from "~/config/units";

type PlayerCellProps = {
  cell: MathCell;
  playerCell: CellState;
  players: PlayerState[];
  onClick: (cell: CellState) => void;
  selected: boolean;
  popperRef?: React.LegacyRef<SVGSVGElement>;
};

export default function PlayerCell({
  cell,
  playerCell,
  players,
  onClick,
  selected,
  popperRef,
}: PlayerCellProps) {
  const { x, y } = cell.toPoint();

  const owner = players.find((p) => p.id === playerCell.ownerId)!;
  const color = (owner && PLAYER_COLORS[owner.index]) || NEUTRAL_COLOR;

  const unit = getUnitForId(playerCell.unitId);

  return (
    <svg ref={popperRef}>
      <g
        strokeWidth={selected ? 10 : 7}
        strokeLinejoin="round"
        onClick={() => onClick(playerCell)}
        transform={`translate(${x + SVG_OFFSET_X}, ${y + SVG_OFFSET_Y}) `}
        className={clsx(color.fill, {
          " stroke-primary-600 ": selected,
          " stroke-gray-600 ": !selected,
        })}
      >
        <unit.SVG />

        <text
          transform={`translate(${HEX_WIDTH / 2 - 0.9}, ${
            HEX_HEIGHT / 2 - 1
          }) `}
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-black stroke-black"
          fontSize="5"
          strokeWidth=".3"
        >
          {playerCell.count}
        </text>
      </g>
    </svg>
  );
}
