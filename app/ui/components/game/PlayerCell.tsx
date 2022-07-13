import clsx from "clsx";
import { motion } from "framer-motion";
import { CellModeSprites, NeutralColor, PlayerColors } from "~/config/graphics";
import {
  MathCell,
  HEX_HEIGHT,
  HEX_WIDTH,
  HEX_STROKE_WIDTH,
  compareCell,
} from "~/core/math";
import { toId } from "~/core/utils";
import {
  useCurrentHostileNeighbors,
  useGameState,
} from "~/ui/context/GameContext";
import { useSelectedCell } from "~/ui/context/SelectedCellContext";
import { useGameTransition } from "~/ui/context/TransitionContext";
import { getAttackPopoverRef } from "./AttackPopovers";

type PlayerCellProps = {
  position: MathCell;
};

export default function PlayerCell({ position }: PlayerCellProps) {
  const { state, directionalPopovers } = useGameState();
  const { selectedCell, setSelectedCell } = useSelectedCell();
  const hostileNeighbors = useCurrentHostileNeighbors();

  const cellState = state.cells[toId(position)];
  const isSelected = compareCell(cellState.position, selectedCell?.position);
  const t = useGameTransition();

  const popperRef = getAttackPopoverRef(
    position,
    directionalPopovers,
    hostileNeighbors
  );
  const { x, y } = position.toPoint();

  const owner = state.players[cellState.ownerId];
  const color = (owner && PlayerColors[owner.index]) || NeutralColor;

  const Sprite = CellModeSprites[cellState.activeModeId];

  const animation = t && t !== "selectingCell" && t.getMotionProps(position);

  const anim = animation
    ? animation
    : isSelected
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
        strokeWidth={isSelected ? HEX_STROKE_WIDTH * 1.25 : HEX_STROKE_WIDTH}
        strokeLinejoin="round"
        onClick={() => setSelectedCell(cellState)}
        transform={`translate(${x - HEX_WIDTH / 2}, ${y - HEX_HEIGHT / 2}) `}
        className={clsx(color.fill, {
          "fill-white": !!animation,
          " stroke-white ": isSelected,
          " stroke-gray-800 ": !isSelected,
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
          {cellState.units}
        </text>
      </g>
    </motion.g>
  );
}
