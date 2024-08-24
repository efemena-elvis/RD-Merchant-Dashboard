// index.ts
import { defineStore } from "pinia";
// import * as state from "./state";
// import * as getters from "./getters";
import * as actions from "./actions";

export const usePaymentStore = defineStore("payment", () => {
  return {
    // ...state,
    // ...getters,
    ...actions,
  };
});
