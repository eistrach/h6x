import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { authenticator } from "~/domain/auth/session.server";

export const action: ActionFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: "/login" });
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};
