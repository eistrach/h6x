import { Cell } from "@prisma/client";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { UnpackData } from "remix-domains";
import MapView from "~/components/MapView";
import { executeAction, executeLoader } from "~/domain/index.server";

import { getMapForUser, updateMap } from "~/domain/map.server";
import { MathCell } from "~/lib/grid";
import { requireUser } from "~/session.server";

export const action: ActionFunction = (args) => {
  return executeAction(updateMap, args, {
    environmentFunction: requireUser,
    redirectTo: (mapId) => `/editor/${mapId}`,
  });
};

const getLoaderData = getMapForUser;
type LoaderData = UnpackData<typeof getLoaderData>;
export const loader: LoaderFunction = (args) => {
  return executeLoader(getLoaderData, args, {
    inputFunction: (args) => args.params.id,
    environmentFunction: requireUser,
  });
};

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
  const { id } = useParams();
  const map = useLoaderData<LoaderData>();
  const [cells, setCells] = useState<Cell[]>(map.cells);
  const [selectedTool, setSelectedTool] = useState<Tool>("add");

  useEffect(() => {
    setCells(map.cells);
  }, [id]);

  const onClick = (cell: MathCell) => {
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
        <ListInput name="cells" value={cells} />
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
