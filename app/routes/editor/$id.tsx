import { Cell } from "@prisma/client";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { composeEventHandlers } from "@remix-run/react/components";
import { useState } from "react";
import useMightyMouse from "react-hook-mighty-mouse";
import { badRequest, notFound, unauthorized } from "remix-utils";
import MapView from "~/components/MapView";
import { Cell as GridCell, CellType, Grid, layoutGrid } from "~/core/grid";
import { getMap, HexMap, updateCells } from "~/models/map.server";
import { requireUserId } from "~/session.server";

function validateCells(cells: Cell[]) {
  const gridCells = cells.map((cell) => GridCell(cell.x, cell.y));
  const grid = Grid(gridCells);
  const queue = [grid[0]];
  const checkedCells = [] as CellType[];

  while (queue.length > 0) {
    const cell = queue.pop()!;
    if (checkedCells.find((c) => c.x === cell.x && c.y === cell.y)) {
      continue;
    }

    checkedCells.push(cell);
    const neighbors = grid.neighborsOf(cell).filter((c) => !!c);
    queue.push(...neighbors);
  }

  return checkedCells.length === gridCells.length;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const id = formData.get("id");

  if (!id || typeof id !== "string" || !id.length) {
    throw badRequest({ message: "id missing" });
  }

  const cellsString = formData.get("cells");

  if (!cellsString || typeof cellsString !== "string") {
    throw badRequest({ message: "cells missing" });
  }

  const cells = JSON.parse(cellsString) as Cell[];

  if (!validateCells(cells)) {
    throw badRequest({ message: "map invalid" });
  }

  updateCells(id, cells);

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

export type Tool = "add" | "remove";

export default function EditorDetailPage() {
  const map = useLoaderData<HexMap>();
  const [cells, setCells] = useState<Cell[]>(map.cells);
  const [selectedTool, setSelectedTool] = useState<Tool>("add");

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

    if (existingCell && selectedTool === "remove") {
      setCells((oldCells) =>
        oldCells.filter(
          (c) =>
            c.x !== newCell.x || c.y !== newCell.y || c.mapId !== newCell.mapId
        )
      );
    } else if (!existingCell && selectedTool === "add") {
      setCells((oldCells) => [...oldCells, newCell]);
    }
  };

  return (
    <div>
      <MapView onSelect={onClick} cells={cells} />
      <Form method="post">
        <input type="hidden" name="id" value={map.id} />
        <input type="hidden" name="cells" value={JSON.stringify(cells)} />
        <button type="submit">Save</button>
      </Form>
      <div onChange={(evt: any) => setSelectedTool(evt.target.value)}>
        <div>Selected tool: {selectedTool}</div>
        <input
          type="radio"
          value="add"
          name="tool"
          checked={selectedTool === "add"}
        />{" "}
        Add
        <input
          type="radio"
          value="remove"
          name="tool"
          checked={selectedTool === "remove"}
          className="ml-2"
        />{" "}
        Remove
      </div>
    </div>
  );
}
