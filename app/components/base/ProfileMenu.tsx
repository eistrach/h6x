import { Menu, Transition } from "@headlessui/react";
import { Form } from "@remix-run/react";
import clsx from "clsx";
import { Fragment } from "react";
import { useUser } from "~/utils";

const ProfileMenu = () => {
  const user = useUser();
  return (
    <Menu as="div" className="ml-4 relative flex-shrink-0">
      <div>
        <Menu.Button className="flex items-center gap-2 p-2 text-sm rounded-sm  text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-500 focus:ring-white">
          <span className="sr-only">Open user menu</span>

          <div className="flex flex-col items-end">
            <span className="font-bold  text-stone-900">
              {user.displayName}
            </span>
            <span className="text-xs text-gray-500">
              #{user.username.split("#")[1]}
            </span>
          </div>
          <div className="w-10 h-10 ring-white ring-2 shadow-md rounded-full bg-white">
            {!!user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                className="object-cover rounded-full"
              ></img>
            ) : (
              <span>{user.displayName[0]}</span>
            )}
          </div>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          {user.isAdmin && (
            <Menu.Item>
              {({ active }) => (
                <Form method="post" action="/prisma/games/delete-all">
                  <button
                    type="submit"
                    className={clsx(
                      active ? "bg-gray-100" : "bg-white",
                      "flex justify-end  w-full px-4 py-2 text-sm font-semibold text-gray-700"
                    )}
                  >
                    Clear all games
                  </button>
                </Form>
              )}
            </Menu.Item>
          )}
          <Menu.Item>
            {({ active }) => (
              <Form method="post" action="/logout">
                <button
                  type="submit"
                  className={clsx(
                    active ? "bg-gray-100" : "bg-white",
                    "flex justify-end  w-full px-4 py-2 text-sm font-semibold text-red-700"
                  )}
                >
                  Logout
                </button>
              </Form>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ProfileMenu;
