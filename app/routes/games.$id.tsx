import { redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useMatches } from "@remix-run/react";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";
import GamePreview from "~/components/map/GamePreview";
import GameView from "~/components/map/GameView";
import {
  buyUnit,
  endTurn,
  getGame,
  startSetupPhase,
  upgradeUnit,
} from "~/domain/game.server";
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
      const players = [...game.players]
        .sort((a, b) => a.id.localeCompare(b.id))
        .filter((player) => player.userId === user.id)!;

      const p = players.find((p) => !(p.setupState as SetupState).done);
      const player = p || players[0];

      const setupState = player.setupState as SetupState;

      return {
        phase: "PREPARATION" as const,
        cells: game.map.cells,
        playerCells: setupState.cells,
        players: setupState.players,
        playerId: setupState.currentPlayerId,
        canTakeAction: !setupState.done,
      };
    case "PLAYING":
      console.log("pp");
      const gameState = game.gameState as PlayingState;
      const currentPlayer = gameState.players.find((p) => p.userId === user.id);
      return {
        phase: "PLAYING" as const,
        cells: game.map.cells,
        playerCells: gameState.cells,
        players: gameState.players,
        playerId: gameState.currentPlayerId,
        canTakeAction: gameState.currentPlayerId === currentPlayer?.id,
      };
  }
};
type LoaderData = UnpackData<typeof loader>;

const Schema = z.union([
  z.object({
    _intent: z.literal("startGame"),
  }),
  z.object({
    _intent: z.literal("buyUnit"),
    position: z.object({
      x: z.preprocess(Number, z.number()),
      y: z.preprocess(Number, z.number()),
    }),
    unitId: z.string().min(1),
    playerId: z.string().min(1),
  }),
  z.object({
    _intent: z.literal("upgradeUnit"),
    position: z.object({
      x: z.preprocess(Number, z.number()),
      y: z.preprocess(Number, z.number()),
    }),
    playerId: z.string().min(1),
  }),
  z.object({
    _intent: z.literal("endTurn"),
    playerId: z.string().min(1),
  }),
]);
export const action = async ({ request, params }: ActionArgs) => {
  const gameId = requireParam(params, "id");
  const user = await requireUser(request);
  const result = await validateForm(request, Schema);

  if (!result.success) {
    return result;
  }

  try {
    switch (result.data._intent) {
      case "startGame":
        await startSetupPhase(gameId);
        break;
      case "buyUnit":
        await buyUnit(
          gameId,
          result.data.playerId,
          result.data.position,
          result.data.unitId
        );
        break;
      case "upgradeUnit":
        await upgradeUnit(gameId, result.data.playerId, result.data.position);
        break;
      case "endTurn":
        await endTurn(gameId, result.data.playerId);
        break;
    }
    return redirect(`/games/${gameId}`);
  } catch (err) {
    return { error: (err as any).toString() };
  }
};

const GamePage = () => {
  const { playerCells, cells, players, canTakeAction, playerId } =
    useLoaderData<LoaderData>();
  const { error } = useActionData() || {};

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div>
      <Toaster position="top-right" />
      <GameView
        players={players}
        playerCells={playerCells}
        cells={cells}
        canTakeAction={canTakeAction}
        playerId={playerId}
      />
    </div>
  );
};

export default GamePage;
