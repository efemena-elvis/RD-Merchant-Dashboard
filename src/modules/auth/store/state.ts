import { ref } from "vue";
import { useStorage } from "@/shared/composables/useStorage";
import constants from "@/utilities/constants";

const { getStorage } = useStorage();
const {
  REDSTONE_AUTH_TOKEN,
  REDSTONE_AUTH_USER,
  REDSTONE_AUTH_BUSINESS,
  REDSTONE_AUTH_BUSINESS_TOKEN,
} = constants;

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

  const authBusiness = ref<string | object>(
    getStorage({
      storage_name: REDSTONE_AUTH_BUSINESS,
      storage_type: "object",
    }) || ""
  );

  const authBusinessToken = ref<string | object>(
    getStorage({
      storage_name: REDSTONE_AUTH_BUSINESS_TOKEN,
      storage_type: "object",
    }) || ""
  );

  return {
    authToken,
    authUser,
    authBusiness,
    authBusinessToken,
  };
}
