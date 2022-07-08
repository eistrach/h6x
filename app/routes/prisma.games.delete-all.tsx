import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { prisma } from "~/db.server";
import { requireUser } from "~/domain/auth/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUser(request);
  await prisma.game.deleteMany();
  return redirect("/games");
};

export const action: ActionFunction = async ({ request }) => {
  await requireUser(request);
  await prisma.game.deleteMany();
  return redirect("/games");
};
