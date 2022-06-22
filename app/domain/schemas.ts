import { CellType } from "@prisma/client";
import { z } from "zod";

export const NullSchema = z.null();

export const IdSchema = z.string().min(1);

export const RequireUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().min(1).email(),
});

export const CreateMapSchema = z.object({ name: z.string().min(1) });

export const UpdateMapSchema = z.object({
  id: z.string().min(1),
  cells: z
    .object({
      x: z.preprocess(Number, z.number()),
      y: z.preprocess(Number, z.number()),
      type: z.nativeEnum(CellType),
      mapId: z.string().min(1),
    })
    .array(),
});
