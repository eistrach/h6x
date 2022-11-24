import { useActionData } from "@remix-run/react";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";
import { requireUser } from "~/lib/auth/session.server";
import { requireParam, validateForm } from "~/lib/validation.server";
import GameView from "~/ui/components/game/GameView";
import {
  startPreparation,
  transitionToNextGameState,
} from "~/domain/game/game.server";
import { CellModeIds } from "~/config/rules";
import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import { GameContextProvider } from "~/ui/context/GameContext";
import { SelectedCellProvider } from "~/ui/context/SelectedCellContext";
import { TransitionContextProvider } from "~/ui/context/TransitionContext";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export const loader = async ({ request, params }: LoaderArgs) => {
  const gameId = requireParam(params, "id");
  const user = await requireUser(request);

  const result = {};

  if (!result) {
    redirect(`/games`);
  }

  return typedjson(result);
};

const Schema = z.union([
  z.object({
    _intent: z.literal("startGame"),
  }),
  z.object({
    _intent: z.literal("changeCellMode"),
    position: z.object({
      x: z.preprocess(Number, z.number()),
      y: z.preprocess(Number, z.number()),
    }),
    cellModeId: z.enum(CellModeIds),
    playerId: z.string().min(1),
  }),
  z.object({
    _intent: z.literal("buyUnit"),
    position: z.object({
      x: z.preprocess(Number, z.number()),
      y: z.preprocess(Number, z.number()),
    }),
    playerId: z.string().min(1),
  }),
  z.object({
    _intent: z.literal("attackCell"),
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
  z.object({
    _intent: z.literal("transitionToNextGameState"),
    playerId: z.string().min(1),
  }),
]);
export const action = async ({ request, params }: ActionArgs) => {
  const gameId = requireParam(params, "id");
  const user = await requireUser(request);
  const result = await validateForm(request, Schema);

  if (!result.success) {
    return {
      error: result.errors.map((e) => `${e.path}: ${e.message}`).join("\n"),
    };
  }

  try {
    switch (result.data._intent) {
      case "startGame":
        await startPreparation(gameId, user.id);
        break;
      case "changeCellMode":
        break;
      case "buyUnit":
        break;
      case "attackCell":
        break;
      case "endTurn":
        break;
      case "transitionToNextGameState":
        await transitionToNextGameState(gameId, result.data.playerId);
    }
    return redirect(`/games/${gameId}`);
  } catch (err) {
    console.log(err);
    return { error: (err as any).toString() };
  }
};

const GamePage = () => {
  const state = useTypedLoaderData<typeof loader>();
  const { error } = useActionData() || {};

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <GameContextProvider value={state}>
      <SelectedCellProvider>
        <TransitionContextProvider>
          <Toaster position="top-right" />

          <div className="min-h-full h-full">
            <GameView />
          </div>
        </TransitionContextProvider>
      </SelectedCellProvider>
    </GameContextProvider>
  );
};

export default GamePage;
