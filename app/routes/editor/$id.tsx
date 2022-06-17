import { Cell } from "@prisma/client";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { badRequest, notFound, unauthorized } from "remix-utils";
import MapView from "~/components/MapView";
import { CellType, layoutGrid } from "~/core/grid";
import { getMap, HexMap } from "~/models/map.server";
import { requireUserId } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const id = formData.get("id");

  if (!id || typeof id !== "string" || !id.length) {
    throw badRequest({ message: "id missing" });
  }

  const cells = formData.get("cells");

  if (!cells || typeof cells !== "string") {
    throw badRequest({ message: "cells missing" });
  }

  console.log(cells);

  return redirect(`/editor/${id}`);
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const map = await getMap(params.id!);

  if (!map) {
    throw notFound({ message: "Map not found" });
  }

  if (map.creatorId !== userId) {
    throw unauthorized({ message: "Unauthorized" });
  }
  return map;
};

export default function EditorDetailPage() {
  const map = useLoaderData<HexMap>();
  const [cells, setCells] = useState<Cell[]>(map.cells);

  const onClick = (cell: CellType) => {
    const newCell = {
      x: cell.x,
      y: cell.y,
      type: "PLAYER",
      mapId: map.id,
    } as Cell;
    const existingCell = cells.find(
      (c) => c.x === newCell.x && c.y === newCell.y && c.mapId === newCell.mapId
    );
    if (existingCell) {
      setCells(
        cells.filter(
          (c) =>
            c.x !== newCell.x || c.y !== newCell.y || c.mapId !== newCell.mapId
        )
      );
    } else {
      setCells([...cells, newCell]);
    }
  };

  console.log(cells);

  return (
    <div>
      <MapView onClick={onClick} cells={layoutGrid} />
      <Form method="post">
        <input type="hidden" name="id" value={map.id} />
        <input type="hidden" name="cells" value={JSON.stringify(cells)} />
        <button type="submit">Save</button>
      </Form>
    </div>
  );
}
