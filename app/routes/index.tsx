import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import HexMap from "~/components/HexMap";

import { Cell, CellType, Map, MapType } from "~/core/grid";

import { Map as Map1 } from "~/maps/map";

export const loader: LoaderFunction = async () => {
  const cells = Map1.Cells.map((cell) =>
    Cell(cell.Point.X + 5, cell.Point.Y + 5)
  );
  return { cells };
};

export default function Index() {
  const { cells } = useLoaderData<{ cells: CellType[] }>();
  return (
    <div className="flex">
      <HexMap cells={cells} />
    </div>
  );
}
