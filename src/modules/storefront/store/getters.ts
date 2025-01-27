import { computed } from "vue";
import { useStorefrontState } from "./state";

export function useStorefrontGetters() {
  const {} = useStorefrontState();

  //   const getAuthToken = computed(() => authToken.value);

  return {};
}
