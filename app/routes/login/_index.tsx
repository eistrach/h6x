import { Form } from "@remix-run/react";
import { authenticator } from "~/lib/auth/session.server";
import { Button } from "~/ui/components/base/Button";
import { DiscordIcon } from "~/ui/components/icons/DiscordIcon";
import { LogoIcon } from "~/ui/components/icons/LogoIcon";
import { InputTheme } from "~/ui/components/base/InputTheme";
import { z } from "zod";
import { validateForm } from "~/lib/validation.server";
import { badRequest } from "remix-utils";
import { LoaderArgs, ActionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderArgs) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/games",
  });
};

const schema = z.object({
  provider: z.enum(["discord"]),
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
        <div>
          <input></input>
        </div>
        <Button
          name="provider"
          value="discord"
          theme={InputTheme.Discord}
          type="submit"
          LeftIcon={DiscordIcon}
        >
          Sign in with Discord
        </Button>
      </div>
    </Form>
  );
};

export default LoginPage;
