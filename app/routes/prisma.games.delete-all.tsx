import { LoaderFunction, redirect } from "@remix-run/node";
import { prisma } from "~/db.server";
import { requireUser } from "~/auth/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUser(request);
  await prisma.game.deleteMany();
  return redirect("/games");
};
