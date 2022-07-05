import { Form } from "@remix-run/react";
import { ActionArgs, LoaderArgs } from "~/utils";
import { authenticator } from "~/auth/session.server";
import { Button } from "~/components/base/Button";
import { DiscordIcon } from "~/components/icons/DiscordIcon";
import { LogoIcon } from "~/components/icons/LogoIcon";
import { InputTheme } from "~/components/base/InputTheme";
import { z } from "zod";
import { validateForm } from "~/utils.server";
import { badRequest } from "remix-utils";
import { GoogleIcon } from "~/components/icons/GoogleIcon";

export const loader = async ({ request }: LoaderArgs) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/games",
  });
};

const schema = z.object({
  provider: z.enum(["discord", "google"]),
});
export const action = async ({ request }: ActionArgs) => {
  const result = await validateForm(request, schema);

  if (!result.success) {
    throw badRequest("Provider not supported");
  }

  return authenticator.authenticate(result.data.provider, request);
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
      <div className="flex flex-col gap-8">
        <Button
          name="provider"
          value="discord"
          theme={InputTheme.Discord}
          type="submit"
          LeftIcon={DiscordIcon}
        >
          Sign in with Discord
        </Button>

        <Button
          name="provider"
          value="google"
          theme={InputTheme.Google}
          type="submit"
          LeftIcon={GoogleIcon}
        >
          Sign in with Google
        </Button>
      </div>
    </Form>
  );
};

export default LoginPage;
