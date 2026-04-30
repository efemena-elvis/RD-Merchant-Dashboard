// index.ts
import { defineStore } from "pinia";
// import * as state from "./state";
// import * as getters from "./getters";
import * as actions from "./actions";

export const useTransferStore = defineStore("transfer", () => {
  return {
    // ...state,
    // ...getters,
    ...actions,
  };
});
