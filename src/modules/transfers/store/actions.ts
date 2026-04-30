import $api from "@/shared/composables/useServiceAPI";
import { transferRoutes } from "./transfer-routes";

export const getBalanceHistory = async (payload: any) => {
  return await $api.fetch(`${transferRoutes.getBalanceHistory}?page=${payload.page}`, {
    resolve: true,
    requiresPublicKey: true,
  });
};

export const getTransactionStats = async (payload: any) => {
  return await $api.fetch(transferRoutes.getTransactionStats, {
    resolve: true,
    requiresPublicKey: true,
  });
};

export const getWallet = async (payload: any) => {
  return await $api.fetch(transferRoutes.getWallet, {
    resolve: true,
    requiresPublicKey: true,
  });
};