import { HexMap } from "@prisma/client";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { badRequest } from "remix-utils";

import { createMap, getMapsForUser } from "~/models/map.server";
import { requireUserId } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const name = formData.get("name");

  if (!name || typeof name !== "string" || !name.length) {
    throw badRequest({ message: "name missing" });
  }

  await createMap(userId, name);

  return redirect(`/editor`);
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  return getMapsForUser(userId);
};

export default function Editor() {
  const grids = useLoaderData<HexMap[]>();
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
