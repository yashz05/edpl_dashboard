import type { AuthProvider } from "@refinedev/core";
import { cookies } from "next/headers";

export const authProviderServer: Pick<AuthProvider, "check"> = {
  check: async () => {
    const cookieStore = cookies();

    const auth = cookieStore.get("token");
    const date = cookieStore.get("date");
    const uuid = cookieStore.get("uuid");
    if (auth && date && uuid) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
    };
  },
};
