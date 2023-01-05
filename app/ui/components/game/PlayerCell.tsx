import { SupportedCellMode } from "@prisma/client";
import clsx from "clsx";
import { motion } from "framer-motion";
import {
  BASE_HEX_STROKE_WIDTH,
  HexCell,
  HEX_HEIGHT,
  HEX_WIDTH,
} from "~/game/game";
import { useSelectedCell } from "~/ui/context/SelectedCellContext";
import AttackerSvg from "../svg/AttackerSvg";
import DefenderSvg from "../svg/DefenderSvg";
import FarmerSvg from "../svg/FarmerSvg";

type PlayerCellProps = {
  cell: HexCell;
};

const CellModeSprites = {
  Offensive: AttackerSvg,
  Defensive: DefenderSvg,
  Productive: FarmerSvg,
} satisfies {
  [key in keyof typeof SupportedCellMode]: React.FC<
    React.SVGProps<SVGSVGElement>
  >;
};

export default function PlayerCell({ cell }: PlayerCellProps) {
  const { selectedCell, setSelectedCell } = useSelectedCell();
  const color = useColor(cell);

  const isSelected = cell.compare(selectedCell);
  const Sprite = CellModeSprites[cell.state.activeModeCode];

  return (
    <motion.g>
      <g
        strokeWidth={
          isSelected ? BASE_HEX_STROKE_WIDTH * 1.25 : BASE_HEX_STROKE_WIDTH
        }
        strokeLinejoin="round"
        onClick={() => setSelectedCell(cell)}
        transform={`translate(${cell.x - HEX_WIDTH / 2}, ${
          cell.y - HEX_HEIGHT / 2
        }) `}
        className={clsx(color.fill, {
          //"fill-white": !!animation,
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
          {cell.state.units}
        </text>
      </g>
    </motion.g>
  );
}

function useColor(cell: HexCell): any {
  throw new Error("Function not implemented.");
}
