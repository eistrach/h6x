import { redirect } from "@remix-run/node";
import { useLoaderData, useMatches } from "@remix-run/react";
import { z } from "zod";
import GamePreview from "~/components/map/GamePreview";
import GameView from "~/components/map/GameView";
import { getGame, startSetupPhase } from "~/domain/game.server";
import { PlayingState, SetupState } from "~/lib/game";
import { requireUser } from "~/session.server";
import { ActionArgs, LoaderArgs, UnpackData } from "~/utils";
import { requireParam, validateForm } from "~/utils.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const gameId = requireParam(params, "id");
  const user = await requireUser(request);
  const game = await getGame(gameId);

  if (!game) {
    throw new Error(`Game ${gameId} not found`);
  }

  switch (game.phase) {
    case "LOBBY":
      return redirect("/games");
    case "PREPARATION":
      const setupState = game.players.find((p) => p.userId === user.id)!
        .setupState as SetupState;

      return {
        phase: "PREPARATION" as const,
        cells: game.map.cells,
        playerCells: setupState.cells,
        players: setupState.players,
      };
    case "PLAYING":
      const gameState = game.gameState as PlayingState;
      return {
        phase: "PLAYING" as const,
        cells: game.map.cells,
        playerCells: gameState.cells,
        players: gameState.players,
      };
  }
};
type LoaderData = UnpackData<typeof loader>;

const Schema = z.object({
  _intent: z.enum(["startGame"]),
});
export const action = async ({ request, params }: ActionArgs) => {
  const gameId = requireParam(params, "id");
  const user = await requireUser(request);
  const result = await validateForm(request, Schema);

  if (!result.success) {
    return result;
  }

  switch (result.data._intent) {
    case "startGame":
      await startSetupPhase(gameId);
      return redirect(`/games/${gameId}`);
  }
};

const GamePage = () => {
  const { playerCells, cells, players } = useLoaderData<LoaderData>();
  const matchingRoutes = useMatches();
  console.log(matchingRoutes);
  return (
    <div>
      <GameView players={players} playerCells={playerCells} cells={cells} />

      <pre>{JSON.stringify({ playerCells }, null, 2)}</pre>
    </div>
  );
};

export default GamePage;
