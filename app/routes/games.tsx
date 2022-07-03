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
      <AnimatePresence initial={false}>{outlet}</AnimatePresence>

      <ul className=" px-6 py-6 mb-16 flex flex-col gap-8 ">
        {games &&
          games.map((game) => <GameCard key={game.id} game={game}></GameCard>)}
      </ul>

      <div className="fixed bottom-0 rounded-t-2xl backdrop-blur-sm left-0 right-0 flex bg-gray-200/50 py-3 px-4 justify-between items-center">
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
