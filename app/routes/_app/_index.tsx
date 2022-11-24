import { Outlet } from "@remix-run/react";
import { Link as RemixLink } from "@remix-run/react";
import { useUser } from "~/core/utils";

import { LogoIcon } from "~/ui/components/icons/LogoIcon";
import ProfileMenu from "~/ui/components/base/ProfileMenu";
import { LoaderArgs, redirect } from "@remix-run/node";

export const loader = ({ request }: LoaderArgs) => {
  if (request.url.endsWith("/app")) return redirect("/games");
  return null;
};

const AppPage = () => {
  const user = useUser();

  return (
    <div>
      {user && (
        <div className="fixed z-10 left-0 right-0 top-0 rounded-b-2xl backdrop-blur-sm h-20 bg-gray-200/50 px-safe pt-safe  flex justify-between items-center">
          <RemixLink
            to="/"
            className="flex gap-1 justify-start items-center pl-4"
          >
            <LogoIcon className="w-10 h-10 " />
            <span className="font-extrabold text-2xl">h6x</span>
          </RemixLink>
          <ProfileMenu />
        </div>
      )}

      <div className="min-h-full h-full mt-16">
        <Outlet />
      </div>
    </div>
  );
};

export default AppPage;
