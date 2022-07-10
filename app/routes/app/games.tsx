import { useLoaderData, useOutlet } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "~/ui/components/base/Link";
import { getGamesForUser } from "~/domain/game/game.server";
import { requireUser } from "~/domain/auth/session.server";
import {
  LoaderArgs,
  UnpackData,
  useDataRefreshOnInterval,
  useUser,
} from "~/core/utils";
import { ChevronDownIcon } from "@heroicons/react/outline";

import { PlusIcon } from "@heroicons/react/solid";
import GameCard from "~/ui/components/game/GameCard";
import { CogIcon } from "@heroicons/react/solid";
import { InputTheme } from "~/ui/components/base/InputTheme";
import { Disclosure } from "@headlessui/react";
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
    <Disclosure defaultOpen>
      {({ open }) => (
        <>
          <Disclosure.Button className="text-left w-full flex justify-between mt-8 mb-2">
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

          <AnimatePresence initial={false}>
            {open && (
              <Disclosure.Panel
                static
                as={motion.ul}
                key="content"
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: { opacity: 1, height: "auto" },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
              >
                <ul className="flex flex-col w-full  sm:flex-row items-center  flex-wrap  gap-4">
                  {games.map((game) => (
                    <GameCard key={game.id} game={game}></GameCard>
                  ))}
                </ul>
              </Disclosure.Panel>
            )}
          </AnimatePresence>
        </>
      )}
    </Disclosure>
  );
};

const getActionableGames = (games: LoaderData, currentUserId: string) => {
  return (
    games?.filter((game) => {
      if (game.isFinished) return false;
      const players = game.players.filter((p) => p.userId === currentUserId);
      return (
        (game.phase === "PLAYING" &&
          !!players.find(
            (p) => game.gameState?.playerIdSequence[0] === p.id
          )) ||
        (game.phase === "PREPARATION" &&
          players.some((p) => !p.preparationState?.done))
      );
    }) || []
  );
};

const GamesPage = () => {
  useDataRefreshOnInterval(1000, false);
  const games = useLoaderData<LoaderData>();
  const outlet = useOutlet();
  const user = useUser();

  const actionableGames = getActionableGames(games, user.id);

  const lobbyGames = games.filter((game) => game.phase === "LOBBY");
  const runningGames = games.filter(
    (game) =>
      !game.isFinished &&
      game.phase !== "LOBBY" &&
      !actionableGames.some((g) => g.id === game.id)
  );

  const finishedGames = games.filter((game) => game.isFinished);

  return (
    <>
      <AnimatePresence initial={false}>{outlet}</AnimatePresence>

      <div className=" px-6  mb-16 flex flex-col ">
        <GameList games={actionableGames} title="Your Turn" />
        <GameList games={lobbyGames} title="Lobby" />
        <GameList games={runningGames} title="Waiting" />
        <GameList games={finishedGames} title="Finished" />
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
    </>
  );
};

export default GamesPage;
