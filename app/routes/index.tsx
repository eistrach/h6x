import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import MapView from "~/components/MapView";

import { Cell, CellType } from "~/core/grid";

import { Map as Map1 } from "~/maps/map";

export const loader: LoaderFunction = async () => {
  const cells = Map1.Cells.map((cell) => Cell(cell.Point.Y, cell.Point.X));
  return { cells };
};

export default function Index() {
  const { cells } = useLoaderData<{ cells: CellType[] }>();
  return (
    <div className="flex">
      <MapView cells={cells} />
    </div>
  );
}
