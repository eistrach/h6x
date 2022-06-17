import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CellType, Grid, SVG_SIZE } from "~/core/grid";
import HexView from "./HexView";

type HexMapProps = {
  cells: CellType[];
  onClick?: (cell: CellType) => void;
};

export default function MapView({ cells, onClick }: HexMapProps) {
  const grid = Grid(...cells);

  return (
    <svg
      className="w-[400px] border border-gray-300"
      viewBox={`0, 0, ${SVG_SIZE}, ${SVG_SIZE}`}
      preserveAspectRatio="xMidYMid"
    >
      <g>
        {grid.map((cell) => (
          <HexView onClick={onClick} key={cell.toString()} cell={cell} />
        ))}
      </g>
    </svg>
  );
}
