import {
  asMathGrid,
  cellsToMathCells,
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
  VIEWBOX_X,
  VIEWBOX_Y,
} from "~/core/math";
import { Cell } from "~/domain/map.server";
import CellPreview from "./CellPreview";

type GamePreviewProps = {
  cells: Cell[];
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
