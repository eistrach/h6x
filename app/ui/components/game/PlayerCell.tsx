import { useTransition } from "@remix-run/react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { startExpiredKeysInterval } from "node-persist";
import { useEffect, useRef, useState } from "react";
import { CellModeSprites, NeutralColor, PlayerColors } from "~/config/graphics";
import { CellState, PlayerStates, PlayingState } from "~/core/actions/types";
import {
  MathCell,
  HEX_HEIGHT,
  HEX_WIDTH,
  HEX_STROKE_WIDTH,
  Point,
  compareCell,
} from "~/core/math";
import { useAttackAnimation } from "~/ui/hooks/useAttackAnimation";

type PlayerCellProps = {
  state: PlayingState;
  nextState?: PlayingState;
  cell: MathCell;
  playerCell: CellState;
  players: PlayerStates;
  onClick: (cell: CellState) => void;
  selected: boolean;
  popperRef?: React.Ref<SVGSVGElement>;
  isTransitioning: boolean;
};

export default function PlayerCell({
  state,
  nextState,
  cell,
  playerCell,
  players,
  onClick,
  selected,
  popperRef,
  isTransitioning,
}: PlayerCellProps) {
  const { x, y } = cell.toPoint();

  const owner = players[playerCell.ownerId];
  const color = (owner && PlayerColors[owner.index]) || NeutralColor;

  const Sprite = CellModeSprites[playerCell.activeModeId];

  const attackAnimation = useAttackAnimation(state, cell, isTransitioning);

  const anim = attackAnimation
    ? {
        animate: {
          x: [
            0,
            (attackAnimation.target.x - attackAnimation.source.x) * 0.7,
            0,
          ],
          y: [
            0,
            (attackAnimation.target.y - attackAnimation.source.y) * 0.7,
            0,
          ],

          scale: [1, 1.1, 1],
        },
        transition: {
          duration: 0.3,
          bounce: 1,
        },
      }
    : selected
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
