import clsx from "clsx";
import { motion } from "framer-motion";
import { CellModeSprites, NeutralColor, PlayerColors } from "~/config/graphics";
import { CellState, PlayerStates } from "~/core/actions/types";
import { MathCell, HEX_HEIGHT, HEX_WIDTH, HEX_STROKE_WIDTH } from "~/core/math";

type PlayerCellProps = {
  cell: MathCell;
  playerCell: CellState;
  players: PlayerStates;
  onClick: (cell: CellState) => void;
  selected: boolean;
  popperRef?: React.Ref<SVGSVGElement>;
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

  const owner = players[playerCell.ownerId];
  const color = (owner && PlayerColors[owner.index]) || NeutralColor;

  const Sprite = CellModeSprites[playerCell.activeModeId];

  const anim = selected
    ? {
        initial: { scale: 1 },
        animate: { scale: 0.9 },
        transition: {
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse" as const,
        },
      }
    : {};

  return (
    <motion.g {...anim}>
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
        <Sprite className={clsx(color.fillSecondary, color.strokeSecondary)} />

        <text
          transform={`translate(${HEX_WIDTH / 2}, ${HEX_HEIGHT / 3}) `}
          dominantBaseline="central"
          textAnchor="middle"
          className="fill-black stroke-black"
          fontSize="30"
          strokeWidth=".2"
        >
          {playerCell.units}
        </text>
      </g>
    </motion.g>
  );
}
