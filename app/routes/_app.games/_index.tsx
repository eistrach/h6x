import { useOutlet } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "~/ui/components/base/Link";
import { requireUser } from "~/lib/auth/session.server";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import GameCard from "~/ui/components/game/GameCard";
import { CogIcon } from "@heroicons/react/24/solid";
import { InputTheme } from "~/ui/components/base/InputTheme";
import { Disclosure } from "@headlessui/react";
import clsx from "clsx";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { Game, getGamesForUser } from "~/game/game.server";
import { LoaderArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);
  const games = await getGamesForUser(user);
  return typedjson(games);
};

const GameList = ({
  games,
  title,
  defaultOpen = true,
}: {
  games: Game[];
  title: string;
  defaultOpen?: boolean;
}) => {
  if (!games.length) return null;

  return (
    <Disclosure defaultOpen={defaultOpen}>
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

const GamesPage = () => {
  const games = useTypedLoaderData<typeof loader>() || [];
  const outlet = useOutlet();

  return (
    <>
      <AnimatePresence initial={false}>{outlet}</AnimatePresence>

      <div className=" px-6  mb-16 flex flex-col ">
        <GameList games={games} title="Games" />
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
