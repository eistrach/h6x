import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CellType, MapType, Map } from "~/core/grid";
import HexCell from "./HexCell";

export default function HexMap({ cells }: { cells: CellType[] }) {
  const map = Map(...cells);
  console.log(map.length);
  return (
    <svg viewBox="0 0 100 100" className="w-[600px]">
      <g>
        {map.map((cell) => (
          <HexCell key={cell.toString()} cell={cell} />
        ))}
      </g>
    </svg>
  );
}
