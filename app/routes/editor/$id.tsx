import { Cell } from "@prisma/client";
import { Form, useLoaderData, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import MapView from "~/components/MapView";

import { cellInGrid, getAllCellsInArea, MathCell, Point } from "~/lib/grid";

import { EditorDetailLoaderData as LoaderData } from "~/api/editor/$id.server";
import { getAppDependencies } from "@remix-run/dev/compiler/dependencies";
import { RadioGroup } from "@headlessui/react";

export {
  editorDetailAction as action,
  editorDetailLoader as loader,
} from "~/api/editor/$id.server";

export type Tool = "add" | "remove";

export const ListInput = ({
  name,
  value,
}: {
  name: string;
  value: object[];
}) => {
  return (
    <>
      {value.flatMap((obj, index) =>
        Object.keys(obj).map((key) => {
          const resolvedName = `${name}[${index}][${key}]`;
          return (
            <input
              type="hidden"
              key={resolvedName}
              name={resolvedName}
              value={(obj as any)[key]}
            />
          );
        })
      )}
    </>
  );
};

export default function EditorDetailPage() {
  const map = useLoaderData<LoaderData>();
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
      <MapView onSelect={onClick} cells={cells} />
      <Form method="post">
        <input type="hidden" name="id" value={map.id} />
        <input type="hidden" name="cells" value={JSON.stringify(cells)} />
        <button type="submit">Save</button>
      </Form>
      <RadioGroup value={selectedTool} onChange={setSelectedTool}>
        <RadioGroup.Label>Tool</RadioGroup.Label>
        <RadioGroup.Option value="add">
          {({ checked }) => (
            <span className={checked ? "bg-blue-200" : ""}>Add</span>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value="remove">
          {({ checked }) => (
            <span className={checked ? "bg-blue-200" : ""}>Remove</span>
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
