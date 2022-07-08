import { SocialsProvider } from "remix-auth-socials";
import { LoaderArgs } from "~/core/utils";
import { authenticator } from "~/domain/auth/session.server";
import { redirect } from "@remix-run/node";
import { requireParam } from "~/utils.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const provider = requireParam(params, "provider");
  try {
    await authenticator.authenticate(provider, request, {
      successRedirect: "/app/games",
      failureRedirect: "/login",
    });
  } catch (error) {
    if (error instanceof Response && error.status === 400) {
      return redirect("/login");
    }
    throw error;
  }
};
