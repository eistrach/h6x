import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { json } from "remix-utils";
import { getGamesForUser } from "~/domain/game.server";
import { requireUser } from "~/session.server";
import { LoaderArgs, UnpackData } from "~/utils";

type LoaderData = UnpackData<typeof getGamesForUser>;

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);
  const games = await getGamesForUser(user.id);
  return games;
};

const GamesPage = () => {
  const games = useLoaderData<LoaderData>();
  return (
    <div>
      <pre>{JSON.stringify(games, null, 2)}</pre>
      <Outlet />
      <Link to="create">Create Game</Link>
    </div>
  );
};

export default GamesPage;
