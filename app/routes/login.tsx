import { Form } from "@remix-run/react";
import { SocialsProvider } from "remix-auth-socials";
import { ActionArgs } from "~/lib/utils";
import { authenticator } from "~/session.server";
import { LoaderArgs } from "~/lib/utils";

export const loader = async ({ request }: LoaderArgs) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/editor",
  });
};

export const action = async ({ request }: ActionArgs) => {
  return authenticator.authenticate(SocialsProvider.DISCORD, request);
};

const LoginPage = () => {
  return (
    <Form method="post">
      <button>Login</button>
    </Form>
  );
};

export default LoginPage;
