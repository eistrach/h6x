import { Cell, CellType } from "@prisma/client";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import MapView from "~/components/map/MapView";
import { cellInGrid, getAllCellsInArea, MathCell, Point } from "~/lib/grid";

import { RadioGroup } from "@headlessui/react";
import { redirect } from "@remix-run/node";
import { z } from "zod";
import {
  errorResult,
  ErrorResult,
  requireParam,
  validateForm,
} from "~/utils.server";
import {
  getMapForUser,
  toggleMapVisibility,
  updateMap,
} from "~/domain/map.server";
import { requireUser } from "~/session.server";
import { badRequest, notFound } from "remix-utils";
import { ActionArgs, LoaderArgs, UnpackData } from "~/utils";
import { validateCellConnections } from "~/domain/validations";

const Schema = z.object({
  _intent: z.enum(["togglePublished", "save"]),
  id: z.string().min(1),
  cells: z.preprocess(
    (arg) => JSON.parse(arg as any),
    z
      .object({
        x: z.preprocess(Number, z.number()),
        y: z.preprocess(Number, z.number()),
        type: z.nativeEnum(CellType),
        mapId: z.string().min(1),
      })
      .array()
    //.refine(validateCellConnections, "Invalid cell connections")
  ),
});
export const action = async ({ request }: ActionArgs) => {
  const [user, result] = await Promise.all([
    requireUser(request),
    validateForm(request, Schema),
  ]);

  if (!result.success) {
    return result;
  }

  switch (result.data._intent) {
    case "togglePublished":
      const map = await toggleMapVisibility(
        result.data.id,
        user.id,
        result.data.cells
      );

      if (!map) {
        return errorResult("cells", "Invalid cell connections");
      }
      break;
    case "save":
      await updateMap(result.data, user.id);
      break;
  }

  return redirect(`/editor/${result.data.id}`);
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await requireUser(request);
  const mapId = requireParam(params, "id");

  const map = await getMapForUser(mapId, user.id);

  if (!map) {
    return notFound(`Map with id ${mapId} not found`);
  }

  return map;
};

type LoaderData = UnpackData<typeof loader>;

export type Tool = "add" | "remove";

export default function EditorDetailPage() {
  const map = useLoaderData<LoaderData>();
  const result = useActionData<ErrorResult | null>();
  const [cells, setCells] = useState<Omit<Cell, "id">[]>(map.cells);
  const [selectedTool, setSelectedTool] = useState<Tool>("add");
  const [isFill, setIsFill] = useState(false);

  const toggleFill = () => setIsFill(!isFill);

  const addCells = (cells: Point[]) => {
    const newCells = cells.map((c) => ({
      x: c.x,
      y: c.y,
      type: "PLAYER" as const,
      mapId: map.id,
    }));
    setCells((oldCells) => [
      ...oldCells.filter((c) => !cellInGrid(c, cells)),
      ...newCells,
    ]);
  };

  const removeCells = (cells: Point[]) => {
    setCells((oldCells) => oldCells.filter((c) => !cellInGrid(c, cells)));
  };

  const onClick = (cell: MathCell) => {
    const cellInGridAlready = cellInGrid(cell, cells);
    if (cellInGridAlready && selectedTool === "remove") {
      const cellsToRemove = isFill ? getAllCellsInArea(cell, cells) : [cell];
      removeCells(cellsToRemove);
    } else if (!cellInGridAlready && selectedTool === "add") {
      const cellsToAdd = isFill ? getAllCellsInArea(cell, cells, true) : [cell];
      addCells(cellsToAdd);
    }
  };

  return (
    <div>
      {!!result && (
        <div>
          <div>Errors: </div>
          <div>
            <pre>{JSON.stringify(result.errors, null, 2)}</pre>
          </div>
        </div>
      )}
      <MapView onSelect={onClick} cells={cells} />
      <p>Published: {map.published.toString()}</p>
      <Form method="post">
        <input type="hidden" name="id" value={map.id} />
        <input type="hidden" name="cells" value={JSON.stringify(cells)} />
        <button name="_intent" value="save" type="submit">
          Save
        </button>
      </Form>
      <Form method="post">
        <input type="hidden" name="id" value={map.id} />
        <input type="hidden" name="cells" value={JSON.stringify(cells)} />
        <button name="_intent" value="togglePublished" type="submit">
          {map.published ? "Unpublish" : "Publish"}
        </button>
      </Form>
      <RadioGroup value={selectedTool} onChange={setSelectedTool}>
        <RadioGroup.Label>Tool</RadioGroup.Label>
        <RadioGroup.Option value="add">
          {({ checked }) => (
            <span className={checked ? "bg-primary-200" : ""}>Add</span>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value="remove">
          {({ checked }) => (
            <span className={checked ? "bg-primary-200" : ""}>Remove</span>
          )}
        </RadioGroup.Option>
      </RadioGroup>
      <input
        type="checkbox"
        checked={isFill}
        onChange={toggleFill}
        name="fill"
        className="ml-2"
      />{" "}
      Fill
    </div>
  );
}
