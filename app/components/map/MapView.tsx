import { Cell } from "@prisma/client";
import { MathCell, asMathGrid, layoutGrid, SVG_SIZE } from "~/lib/grid";
import HexView from "./CellView";

type HexMapProps = {
  cells: Omit<Cell, "id">[];
  onSelect?: (cell: MathCell) => void;
};

export default function MapView({ cells, onSelect }: HexMapProps) {
  function isFilled(x: number, y: number) {
    return !!cells.find((cell) => cell.x === x && cell.y === y);
  }

  return (
    <svg
      className="w-[400px] border border-gray-300"
      viewBox={`0, 0, ${SVG_SIZE}, ${SVG_SIZE}`}
      preserveAspectRatio="xMidYMid"
    >
      <g>
        {layoutGrid.map((cell) => (
          <HexView
            onSelect={onSelect}
            fill={isFilled(cell.x, cell.y)}
            key={cell.toString()}
            cell={cell}
          />
        ))}
      </g>
    </svg>
  );
}
