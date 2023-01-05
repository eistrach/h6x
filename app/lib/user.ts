import { User } from "./user.server";
import { useMatchesData } from "./utils";

function isUser(user: any): user is User & { isAdmin: boolean } {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): (User & { isAdmin: boolean }) | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User & { isAdmin: boolean } {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}
