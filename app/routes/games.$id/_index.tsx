import { useActionData } from "@remix-run/react";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";
import { requireUser } from "~/lib/auth/session.server";
import { requireParam, validateForm } from "~/lib/validation.server";
import GameView from "~/ui/components/game/GameView";
import { CellModeIds } from "~/config/rules";
import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import { GameContextProvider } from "~/ui/context/GameContext";
import { SelectedCellProvider } from "~/ui/context/SelectedCellContext";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { getGameState } from "~/game/game.server";
import { transitionToPreparationState } from "~/game/preparing.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const gameId = requireParam(params, "id");
  const user = await requireUser(request);

  const result = await getGameState(gameId, user);

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
      q: z.preprocess(Number, z.number()),
      r: z.preprocess(Number, z.number()),
    }),
    cellModeId: z.enum(CellModeIds),
    userId: z.string().min(1),
  }),
  z.object({
    _intent: z.literal("buyUnit"),
    position: z.object({
      x: z.preprocess(Number, z.number()),
      y: z.preprocess(Number, z.number()),
    }),
    userId: z.string().min(1),
  }),
  z.object({
    _intent: z.literal("attackCell"),
    position: z.object({
      q: z.preprocess(Number, z.number()),
      r: z.preprocess(Number, z.number()),
    }),
    target: z.object({
      q: z.preprocess(Number, z.number()),
      r: z.preprocess(Number, z.number()),
    }),
    userId: z.string().min(1),
  }),
  z.object({
    _intent: z.literal("endTurn"),
    userId: z.string().min(1),
  }),
  z.object({
    _intent: z.literal("transitionToNextGameState"),
    userId: z.string().min(1),
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
        await transitionToPreparationState(user, gameId);
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
        break;
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
        <Toaster position="top-right" />

        <div className="min-h-full h-full">
          <GameView />
        </div>
      </SelectedCellProvider>
    </GameContextProvider>
  );
};

export default GamePage;
