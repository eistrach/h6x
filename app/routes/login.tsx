import { Form } from "@remix-run/react";
import { SocialsProvider } from "remix-auth-socials";
import { ActionArgs, LoaderArgs } from "~/utils";
import { authenticator } from "~/session.server";
import { Button } from "~/components/base/Button";
import { DiscordIcon } from "~/components/icons/DiscordIcon";
import { LogoIcon } from "~/components/icons/LogoIcon";
import { InputTheme } from "~/components/base/InputTheme";

export const loader = async ({ request }: LoaderArgs) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/games",
  });
};

export const action = async ({ request }: ActionArgs) => {
  return authenticator.authenticate(SocialsProvider.DISCORD, request);
};

const LoginPage = () => {
  return (
    <Form
      method="post"
      className="flex flex-col h-screen justify-around items-center"
    >
      <div className="flex gap-4 justify-start items-center">
        <LogoIcon className="w-28" />
        <span className="font-extrabold text-6xl">h6x</span>
      </div>
      <div>
        <Button theme={InputTheme.Discord} type="submit" LeftIcon={DiscordIcon}>
          Sign in with Discord
        </Button>
      </div>
    </Form>
  );
};

export default LoginPage;
