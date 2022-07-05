import { redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";

import {
  attack,
  buy,
  end,
  getGame,
  startSetupPhase,
  upgrade,
} from "~/domain/game.server";

import { PlayingState, SetupState } from "~/lib/game";
import { requireUser } from "~/session.server";
import {
  ActionArgs,
  LoaderArgs,
  UnpackData,
  useDataRefreshOnInterval,
} from "~/utils";
import { requireParam, validateForm } from "~/utils.server";

import styles from "~/custom.css";
import { LinksFunction } from "@remix-run/node";
import GameView from "~/components/game/GameView";
export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

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
        playerCells: setupState.cells,
        players: setupState.players,
        playerId: setupState.currentPlayerId,
        canTakeAction: !setupState.done,
      };
    case "PLAYING":
      const gameState = game.gameState as PlayingState;
      const currentPlayer = gameState.players.find((p) => p.userId === user.id);
      return {
        phase: "PLAYING" as const,
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
    unitId: z.enum(["default", "attacker", "defender", "farmer", "snowballer"]),
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
    _intent: z.literal("attackUnit"),
    position: z.object({
      x: z.preprocess(Number, z.number()),
      y: z.preprocess(Number, z.number()),
    }),
    target: z.object({
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
        await buy(
          gameId,
          result.data.playerId,
          result.data.position,
          result.data.unitId
        );
        break;
      case "upgradeUnit":
        await upgrade(gameId, result.data.playerId, result.data.position);
        break;
      case "attackUnit":
        await attack(
          gameId,
          result.data.playerId,
          result.data.position,
          result.data.target
        );

        break;
      case "endTurn":
        await end(gameId, result.data.playerId);
        break;
    }
    return redirect(`/games/${gameId}`);
  } catch (err) {
    return { error: (err as any).toString() };
  }
};

const GamePage = () => {
  const gameState = useLoaderData<LoaderData>();
  const { error } = useActionData() || {};
  useDataRefreshOnInterval(1000);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  });

  return (
    <div>
      <Toaster position="top-right" />
      <GameView state={gameState} />
    </div>
  );
};

export default GamePage;
