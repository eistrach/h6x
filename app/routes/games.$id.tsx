import { redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";

import { requireUser } from "~/domain/auth/session.server";
import { ActionArgs, LoaderArgs, useDataRefreshOnInterval } from "~/core/utils";
import { requireParam, validateForm } from "~/utils.server";

import GameView from "~/ui/components/game/GameView";
import {
  GameWithState,
  getGameWithState,
  startPreparation,
} from "~/domain/game/game.server";
import { changeCellMode } from "~/domain/game/changeCellMode/index.server";
import { CellModeIds } from "~/config/rules";
import { buyUnit } from "~/domain/game/buyUnit/index.server";
import { attackCell } from "~/domain/game/attackCell/index.server";
import { endTurn } from "~/domain/game/endTurn/index.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const gameId = requireParam(params, "id");
  const user = await requireUser(request);

  const result = await getGameWithState(gameId, user);

  if (!result) {
    redirect(`/games`);
  }

  return result;
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
        await changeCellMode(
          gameId,
          result.data.playerId,
          result.data.position,
          result.data.cellModeId
        );
        break;
      case "buyUnit":
        await buyUnit(gameId, result.data.playerId, result.data.position);
        break;
      case "attackCell":
        await attackCell(
          gameId,
          result.data.playerId,
          result.data.position,
          result.data.target
        );

        break;
      case "endTurn":
        await endTurn(gameId, result.data.playerId);
        break;
    }
    return redirect(`/games/${gameId}`);
  } catch (err) {
    console.log(err);
    return { error: (err as any).toString() };
  }
};

const GamePage = () => {
  const state = useLoaderData<GameWithState>();
  const { error } = useActionData() || {};
  useDataRefreshOnInterval(1000);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div>
      <Toaster position="top-right" />

      <div className="min-h-full h-full">
        <GameView {...state} />
      </div>
    </div>
  );
};

export default GamePage;
