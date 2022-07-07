import { Cell } from "@prisma/client";
import {
  asMathGrid,
  cellsToMathCells,
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
  VIEWBOX_X,
  VIEWBOX_Y,
} from "~/grid-math";
import CellPreview from "./CellPreview";

type GamePreviewProps = {
  cells: Omit<Cell, "id">[];
  className?: string;
  cellClassName?: string;
};

export default function GamePreview({
  cells,
  className,
  cellClassName,
}: GamePreviewProps) {
  const grid = asMathGrid(cellsToMathCells(cells));
  return (
    <svg
      className={className}
      viewBox={`${VIEWBOX_X}, ${VIEWBOX_Y}, ${VIEWBOX_WIDTH}, ${VIEWBOX_HEIGHT}`}
      fill="currentColor"
      preserveAspectRatio="xMidYMid"
    >
      <g>
        {grid.map((cell) => (
          <CellPreview
            key={cell.toString()}
            cell={cell}
            className={cellClassName}
          />
        ))}
      </g>
    </svg>
  );
}
