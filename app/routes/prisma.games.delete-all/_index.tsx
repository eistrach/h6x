import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { requireUser } from "~/lib/auth/session.server";
import { prisma } from "~/lib/db.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUser(request);
  return redirect("/games");
};

export const action: ActionFunction = async ({ request }) => {
  await requireUser(request);
  await prisma.game.deleteMany();
  return redirect("/games");
};
