import { useLoaderData, useOutlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { Link } from "~/components/base/Link";
import { getGamesForUser } from "~/domain/game.server";
import { requireUser } from "~/session.server";
import { LoaderArgs, UnpackData } from "~/utils";

import { PlusIcon } from "@heroicons/react/solid";
import GameCard from "~/components/game/GameCard";
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
    <div className="relative min-h-screen">
      <ul className="my-8 mx-4 flex flex-col gap-4 ">
        {games &&
          games.map((game) => <GameCard key={game.id} game={game}></GameCard>)}
      </ul>
      <AnimatePresence initial={false}>{outlet}</AnimatePresence>

      <Link
        className="fixed bottom-10 right-8"
        motionProps={{ layoutId: "createGame" }}
        LeftIcon={PlusIcon}
        to="create"
      />
    </div>
  );
};

export default GamesPage;
