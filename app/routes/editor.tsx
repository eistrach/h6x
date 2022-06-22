import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { UnpackData } from "remix-domains";
import { executeAction, executeLoader } from "~/domain/index.server";

import { createMap, getMapsForUser } from "~/domain/map.server";
import { requireUser } from "~/session.server";

export const action: ActionFunction = (args) => {
  return executeAction(createMap, args, {
    environmentFunction: requireUser,
    redirectTo: (map) => `/editor/${map.id}`,
  });
};

const getLoaderData = getMapsForUser;
type LoaderData = UnpackData<typeof getLoaderData>;
export const loader: LoaderFunction = (args) => {
  return executeLoader(getLoaderData, args, {
    environmentFunction: requireUser,
  });
};

export default function Editor() {
  const grids = useLoaderData<LoaderData>();
  return (
    <div className="flex flex-col  md:flex-row m-4 gap-8">
      <div className="flex flex-col gap-2">
        <ul className="">
          {grids.map((grid) => (
            <li key={grid.id}>
              <NavLink to={grid.id}>{grid.name}</NavLink>
            </li>
          ))}
        </ul>
        {!grids.length && <span>Add new map</span>}
        <Form method="post" className="flex gap-2">
          <input type="text" name="name" />
          <button type="submit">Add</button>
        </Form>
      </div>
      <div className="mx-auto">
        <Outlet />
      </div>
    </div>
  );
}
