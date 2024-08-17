// state.ts
import { ref } from "vue";
import { useStorage } from "@/shared/composables/useStorage";
import constants from "@/utilities/constants";

const { getStorage } = useStorage();
const { REDSTONE_AUTH_TOKEN, REDSTONE_AUTH_USER } = constants;

export function useAuthState() {
  const authToken = ref<string | object>(
    getStorage({
      storage_name: REDSTONE_AUTH_TOKEN,
    }) || ""
  );

  const authUser = ref<string | object>(
    getStorage({
      storage_name: REDSTONE_AUTH_USER,
      storage_type: "object",
    }) || ""
  );

  return {
    authToken,
    authUser,
  };
}
