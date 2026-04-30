// index.ts
import { defineStore } from "pinia";
import * as state from "./state";
import * as getters from "./getters";
import { useExternalActions } from "./actions";
import { useExternalMutations } from "./mutations";

export const useExternalStore = defineStore("external", () => {
  const mutations = useExternalMutations();
  const actions = useExternalActions();

  return {
    ...state,
    ...getters,
    ...actions,
    ...mutations,
  };
});
