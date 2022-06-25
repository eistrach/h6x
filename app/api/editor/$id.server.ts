import { IdSchema } from "./../../domain/schemas";
import { CellType } from "@prisma/client";
import { redirect } from "@remix-run/node";
import { z } from "zod";
import {
  assertUser,
  createAction,
  createLoader,
  param,
} from "~/domain/index.server";
import { getMapForUser, updateMap } from "~/domain/map.server";

const Schema = z.object({
  id: z.string().min(1),
  cells: z.preprocess(
    (arg) => JSON.parse(arg as any),
    z
      .object({
        x: z.preprocess(Number, z.number()),
        y: z.preprocess(Number, z.number()),
        type: z.nativeEnum(CellType),
        mapId: z.string().min(1),
      })
      .array()
  ),
});

export const editorDetailAction = createAction(Schema, async (map, ctx) => {
  assertUser(ctx);
  await updateMap(map, ctx.user.id);
  return redirect(`/editor/${map.id}`);
});

export const editorDetailLoader = createLoader(async (ctx) => {
  assertUser(ctx);
  const mapId = param(ctx, "id");
  return getMapForUser(mapId, ctx.user.id);
});

export type EditorDetailLoaderData = Awaited<
  ReturnType<typeof editorDetailLoader>
>;
