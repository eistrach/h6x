import { useLoaderData, useOutlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { Link } from "~/components/base/Link";
import { getGamesForUser } from "~/domain/game.server";
import { requireUser } from "~/session.server";
import { LoaderArgs, UnpackData } from "~/utils";

import { PlusIcon } from "@heroicons/react/solid";
import GameCard from "~/components/game/GameCard";
import { CogIcon } from "@heroicons/react/solid";
import { IconButton } from "~/components/base/IconButton";
import { InputTheme } from "~/components/base/InputTheme";
type LoaderData = UnpackData<typeof getGamesForUser>;

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);
  const games = await getGamesForUser(user.id);
  return games;
};

const GamesPage = () => {
  const games = useLoaderData<LoaderData>();
  const outlet = useOutlet();
  return (
    <div className="min-h-full h-full">
      <ul className=" px-4 border-y-2 border-black py-4 flex flex-col  gap-4 max-h-[calc(100vh-8rem)] overflow-auto">
        {games &&
          games.map((game) => <GameCard key={game.id} game={game}></GameCard>)}
      </ul>
      <AnimatePresence initial={false}>{outlet}</AnimatePresence>

      <div className="flex bg-yellow-200 py-3 px-4 justify-between items-center">
        <Link
          motionProps={{ layoutId: "openSettings" }}
          theme={InputTheme.OutlinedBlack}
          LeftIcon={CogIcon}
          to="settings"
        >
          Settings
        </Link>
        <Link
          motionProps={{ layoutId: "createGame" }}
          LeftIcon={PlusIcon}
          to="create"
        >
          New Game
        </Link>
      </div>
    </div>
  );
};

export default GamesPage;
