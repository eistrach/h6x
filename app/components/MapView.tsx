import { Cell } from "@prisma/client";
import { CellType, Grid, layoutGrid, SVG_SIZE } from "~/core/grid";
import HexView from "./HexView";

type HexMapProps = {
  cells: Cell[];
  onSelect?: (cell: CellType) => void;
};

export default function MapView({ cells, onSelect }: HexMapProps) {
  const grid = Grid(...layoutGrid);

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
        {grid.map((cell) => (
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
