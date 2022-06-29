import { redirect } from "@remix-run/node";
import { joinGame } from "~/domain/game.server";
import { requireUser } from "~/session.server";
import { LoaderArgs } from "~/utils";
import { requireParam } from "~/utils.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const gameId = requireParam(params, "id");
  const user = await requireUser(request);

  await joinGame(gameId, user.id);

  return redirect("/games");
};
