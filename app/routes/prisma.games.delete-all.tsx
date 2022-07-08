import { ActionFunction, redirect } from "@remix-run/node";
import { prisma } from "~/db.server";
import { requireUser } from "~/domain/auth/session.server";

export const action: ActionFunction = async ({ request }) => {
  await requireUser(request);
  await prisma.game.deleteMany();
  return redirect("/games");
};
