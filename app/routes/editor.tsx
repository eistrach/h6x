import {
  Form,
  NavLink,
  Outlet,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { z } from "zod";
import { createMap, getMapsForUser } from "~/domain/map.server";
import type { ActionArgs, LoaderArgs, UnpackData } from "~/core/utils";
import { validateForm } from "~/utils.server";
import { requireAdmin, requireUser } from "~/domain/auth/session.server";

const Schema = z.object({ name: z.string().min(1) });
export const action = async ({ request }: ActionArgs) => {
  const [user, result] = await Promise.all([
    requireAdmin(request),
    validateForm(request, Schema),
  ]);

  if (!result.success) {
    return result;
  }

  const map = await createMap(result.data.name, user.id);
  return redirect(`/editor/${map.id}`);
};

type LoaderData = UnpackData<typeof getMapsForUser>;
export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);
  return getMapsForUser(user.id);
};

export default function Editor() {
  let location = useLocation();
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
      <div>
        <Outlet key={location.pathname} />
      </div>
    </div>
  );
}
