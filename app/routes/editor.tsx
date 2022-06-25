import {
  Form,
  NavLink,
  Outlet,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { EditorLoaderData as LoaderData } from "../api/editor.server";

export {
  editorAction as action,
  editorLoader as loader,
} from "../api/editor.server";

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
      <div className="mx-auto">
        <Outlet key={location.pathname} />
      </div>
    </div>
  );
}
