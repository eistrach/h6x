import { useLoaderData, useOutlet } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "~/components/base/Link";
import { getGamesForUser } from "~/domain/game.server";
import { requireUser } from "~/auth/session.server";
import {
  LoaderArgs,
  UnpackData,
  useDataRefreshOnInterval,
  useUser,
} from "~/utils";
import { ChevronDownIcon } from "@heroicons/react/outline";

import { PlusIcon } from "@heroicons/react/solid";
import GameCard from "~/components/game/GameCard";
import { CogIcon } from "@heroicons/react/solid";
import { InputTheme } from "~/components/base/InputTheme";
import { Disclosure, Transition } from "@headlessui/react";
import clsx from "clsx";
type LoaderData = UnpackData<typeof getGamesForUser>;

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);
  const games = await getGamesForUser(user.id);
  return games;
};

const GameList = ({ games, title }: { games: LoaderData; title: string }) => {
  if (!games.length) return null;

  return (
    <Disclosure as="div" defaultOpen>
      {({ open }) => (
        <>
          <Disclosure.Button className="text-left w-full flex justify-between mb-8">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{title}</h2>
              <span className="text-lg font-semibold text-gray-700">
                ({games.length})
              </span>
            </div>
            <span className="ml-6 h-7 flex items-center">
              <ChevronDownIcon
                className={clsx(
                  open ? "-rotate-180" : "rotate-0",
                  "h-6 w-6 transform"
                )}
                aria-hidden="true"
              />
            </span>
          </Disclosure.Button>

          <Disclosure.Panel>
            <ul className="flex flex-col gap-8">
              {games.map((game) => (
                <GameCard key={game.id} game={game}></GameCard>
              ))}
            </ul>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

const getActionableGames = (games: LoaderData, currentUserId: string) => {
  return games.filter((game) => {
    const player = game.players.find((p) => p.userId === currentUserId);
    return (
      (game.phase === "PLAYING" &&
        game.gameState?.currentPlayerId === player?.id) ||
      (game.phase === "PREPARATION" && !player?.setupState?.done)
    );
  });
};

const GamesPage = () => {
  useDataRefreshOnInterval(1000);
  const games = useLoaderData<LoaderData>();
  const outlet = useOutlet();
  const user = useUser();

  const actionableGames = getActionableGames(games, user.id);

  const lobbyGames = games.filter((game) => game.phase === "LOBBY");
  const runningGames = games.filter(
    (game) =>
      game.phase !== "LOBBY" && !actionableGames.some((g) => g.id === game.id)
  );

  return (
    <div className="min-h-full h-full">
      <AnimatePresence initial={false}>{outlet}</AnimatePresence>

      <div className=" px-6 py-6 mb-16 flex flex-col gap-20 ">
        <GameList games={actionableGames} title="Your Turn" />
        <GameList games={lobbyGames} title="Lobby" />
        <GameList games={runningGames} title="Waiting" />
      </div>

      <motion.div
        layoutId="background"
        className="fixed bottom-0 rounded-t-2xl backdrop-blur-sm left-0 right-0 flex bg-gray-200/50 py-3 px-4 justify-between items-center"
      >
        <Link
          motionProps={{ layoutId: "leftButton" }}
          theme={InputTheme.OutlinedBlack}
          LeftIcon={CogIcon}
          to="settings"
        >
          Settings
        </Link>
        <Link
          motionProps={{ layoutId: "rightButton" }}
          LeftIcon={PlusIcon}
          to="create"
        >
          New Game
        </Link>
      </motion.div>
    </div>
  );
};

export default GamesPage;
