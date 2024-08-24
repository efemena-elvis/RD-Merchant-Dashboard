import $api from "@/shared/composables/useServiceAPI";
import { transferRoutes } from "./transfer-routes";

export const getBalanceHistory = async () => {
  return await $api.fetch(transferRoutes.getBalanceHistory, {
    resolve: true,
    requiresPublicKey: true,
  });
};
