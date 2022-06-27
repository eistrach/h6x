import { SocialsProvider } from "remix-auth-socials";
import { LoaderArgs } from "~/utils";
import { authenticator } from "~/session.server";
import { redirect } from "@remix-run/node";

export const loader = async ({ request }: LoaderArgs) => {
  try {
    await authenticator.authenticate(SocialsProvider.DISCORD, request, {
      successRedirect: "/games",
      failureRedirect: "/login",
    });
  } catch (error) {
    if (error instanceof Response && error.status === 400) {
      return redirect("/login");
    }
    throw error;
  }
};
