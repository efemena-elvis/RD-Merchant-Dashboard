// actions.ts
import $api from "@/shared/composables/useServiceAPI";
import { useAuthState } from "./state";
import { authRoutes } from "./auth-routes";

export function useAuthActions() {
  const { authToken, authUser } = useAuthState();

  const loginUser = async (payload: any) => {
    console.log("PAYLOAD", payload);

    const response = await $api.push(authRoutes.login, { payload });
    console.log("RESPONSE", response);
    // return response;
  };

  return {
    loginUser,
  };
}
