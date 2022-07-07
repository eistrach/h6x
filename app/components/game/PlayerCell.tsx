import clsx from "clsx";
import { NEUTRAL_COLOR, PLAYER_COLORS } from "~/config/config";
import { CellState, PlayerState } from "~/domain/logic/game";
import { MathCell, HEX_HEIGHT, HEX_WIDTH, HEX_STROKE_WIDTH } from "~/grid-math";
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
    <g
      ref={popperRef}
      strokeWidth={selected ? HEX_STROKE_WIDTH * 1.25 : HEX_STROKE_WIDTH}
      strokeLinejoin="round"
      onClick={() => onClick(playerCell)}
      transform={`translate(${x - HEX_WIDTH / 2}, ${y - HEX_HEIGHT / 2}) `}
      className={clsx(color.fill, {
        " stroke-white ": selected,
        " stroke-gray-800 ": !selected,
      })}
    >
      <unit.SVG className={clsx(color.fillSecondary, color.strokeSecondary)} />

      <text
        transform={`translate(${HEX_WIDTH / 2}, ${HEX_HEIGHT / 3}) `}
        dominantBaseline="central"
        textAnchor="middle"
        className="fill-black stroke-black"
        fontSize="30"
        strokeWidth=".2"
      >
        {playerCell.count}
      </text>
    </g>
  );
}
