import { Cell } from "@prisma/client";
import { asMathGrid, SVG_SIZE, cellsToMathCells } from "~/lib/grid";
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
      viewBox={`0, 0, ${SVG_SIZE}, ${SVG_SIZE}`}
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
