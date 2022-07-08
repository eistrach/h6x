import { LoaderArgs } from "~/core/utils";
import { authenticator, sessionStorage } from "~/domain/auth/session.server";
import { redirect } from "@remix-run/node";
import { requireParam } from "~/utils.server";
import { redirectCookie } from "~/cookies";

export const loader = async ({ request, params }: LoaderArgs) => {
  const provider = requireParam(params, "provider");
  try {
    const userId = await authenticator.authenticate(provider, request, {
      failureRedirect: "/login",
    });
    const cookie = request.headers.get("Cookie");

    const redirectUrl = (await redirectCookie.parse(cookie)) || "/app/games";

    let session = await sessionStorage.getSession(
      request.headers.get("cookie")
    );
    // and store the user data
    session.set(authenticator.sessionKey, userId);

    return redirect(redirectUrl, {
      headers: [
        ["Set-Cookie", await redirectCookie.serialize("")],
        ["Set-Cookie", await sessionStorage.commitSession(session)],
      ],
    });
  } catch (error) {
    if (error instanceof Response && error.status === 400) {
      return redirect("/login");
    }
    throw error;
  }
};
