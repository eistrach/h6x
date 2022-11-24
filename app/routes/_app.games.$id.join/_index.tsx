import { LoaderArgs, redirect } from "@remix-run/node";
import { useEffect } from "react";
import { joinGame } from "~/game/game.server";
import { requireUser } from "~/lib/auth/session.server";
import { requireParam } from "~/lib/validation.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const gameId = requireParam(params, "id");
  const user = await requireUser(request);

  await joinGame(gameId, user);

  return redirect("/games");
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  useEffect(() => {
    alert(error);
  });
  return <></>;
};
