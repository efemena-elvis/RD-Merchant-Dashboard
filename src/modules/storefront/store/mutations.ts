import axios from "axios";
import { useStorefrontState } from "./state";
import { useStorage } from "@/shared/composables/useStorage";

const { setStorage } = useStorage();

export function useStorefrontMutations() {
  const {} = useStorefrontState();

  return {};
}
