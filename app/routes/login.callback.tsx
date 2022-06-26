import { SocialsProvider } from "remix-auth-socials";
import { LoaderArgs } from "~/lib/utils";
import { authenticator } from "~/session.server";

export const loader = ({ request }: LoaderArgs) => {
  return authenticator.authenticate(SocialsProvider.DISCORD, request, {
    successRedirect: "/editor",
    failureRedirect: "/login",
  });
};
