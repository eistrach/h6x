import { Form } from "@remix-run/react";
import { SocialsProvider } from "remix-auth-socials";
import { ActionArgs, LoaderArgs } from "~/utils";
import { authenticator } from "~/session.server";

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
    <Form method="post">
      <button>Login</button>
    </Form>
  );
};

export default LoginPage;
