import { Cell } from "@prisma/client";
import {
  MathCell,
  asMathGrid,
  layoutGrid,
  SVG_SIZE,
  cellsToPoints,
  cellsToMathCells,
} from "~/lib/grid";
import CellPreview from "./CellPreview";
import CellView from "./CellView";

type GamePreviewProps = {
  cells: Omit<Cell, "id">[];
  className?: string;
};

export default function GamePreview({ cells, className }: GamePreviewProps) {
  const grid = asMathGrid(cellsToMathCells(cells));
  return (
    <svg
      className={className}
      viewBox={`0, 0, ${SVG_SIZE}, ${SVG_SIZE}`}
      preserveAspectRatio="xMidYMid"
    >
      <g>
        {grid.map((cell) => (
          <CellPreview
            key={cell.toString()}
            cell={cell}
            className="fill-yellow-100 "
          />
        ))}
      </g>
    </svg>
  );
}
