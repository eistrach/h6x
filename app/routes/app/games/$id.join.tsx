import { redirect } from "@remix-run/node";
import { useEffect } from "react";
import { joinGame } from "~/domain/game/game.server";
import { requireUser } from "~/domain/auth/session.server";
import { LoaderArgs } from "~/core/utils";
import { requireParam } from "~/utils.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const gameId = requireParam(params, "id");
  const user = await requireUser(request);

  await joinGame(gameId, user.id);

  return redirect("/app/games");
};

export default function Test() {
  return <div>Test</div>;
}

export const CatchBoundary = () => {
  return <div>Catch</div>;
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  useEffect(() => {
    alert(error);
  });
  return <></>;
};
