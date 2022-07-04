import { Form, useFetcher } from "@remix-run/react";
import clsx from "clsx";
import { useState } from "react";
import { usePopper } from "react-popper";
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
import { getUnitForId, UnitId } from "~/lib/units";
import AttackerSvg from "./cells/AttackerSvg";
import DefaultSvg from "./cells/DefaultSvg";
import DefenderSvg from "./cells/DefenderSvg";
import FarmerSvg from "./cells/FarmerSvg";
import SnowballerSvg from "./cells/SnowballerSvg";

type PlayerCellProps = {
  cell: MathCell;
  playerCell: CellState;
  players: PlayerState[];
  onClick: (cell: CellState, player: PlayerState) => void;
  selected: boolean;
  popperRef?: React.LegacyRef<SVGSVGElement>;
};

const UnitComponent = {
  attacker: AttackerSvg,
  default: DefaultSvg,
  defender: DefenderSvg,
  farmer: FarmerSvg,
  snowballer: SnowballerSvg,
};

const Unit = (unitId: UnitId) => {
  const unit = getUnitForId(unitId);
  const Component = UnitComponent[unit.id];
  return <Component />;
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

  const player = players.find((p) => p.id === playerCell.ownerId)!;
  const color = (player && PLAYER_COLORS[player.index]) || NEUTRAL_COLOR;

  const unit = getUnitForId(playerCell.unitId);
  const Component = UnitComponent[unit.id];

  return (
    <svg ref={popperRef}>
      <g
        strokeWidth={selected ? 10 : 7}
        strokeLinejoin="round"
        onClick={() => onClick(playerCell, player)}
        transform={`translate(${x + SVG_OFFSET_X}, ${y + SVG_OFFSET_Y}) `}
        className={clsx(color.fill, {
          " stroke-lime-600 ": selected,
          " stroke-gray-600 ": !selected,
        })}
      >
        <Component />

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

        {/* <polygon
          
          points={cellCorners
            .map((corner) => `${corner.x},${corner.y}`)
            .join(" ")}
        /> */}
      </g>
    </svg>
  );
}
