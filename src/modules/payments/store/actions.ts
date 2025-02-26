import $api from "@/shared/composables/useServiceAPI";
import { paymentRoutes } from "./payment-routes";

export const getTransactions = async () => {
  return await $api.fetch(paymentRoutes.getPaymentTransactions, {
    resolve: true,
    requiresPublicKey: true,
  });
};

export const getCustomers = async () => {
  return await $api.fetch(paymentRoutes.getCustomers, {
    resolve: true,
    requiresPublicKey: true,
  });
};

export const initiatePayout = async (payload: any) => {
  return await $api.push(paymentRoutes.initiatePayout, {
    payload,
    requiresPublicKey: true,
  });
};

export const fetchAllPayouts = async () => {
  return await $api.fetch(paymentRoutes.getAllPayouts, {
    resolve: true,
    requiresPublicKey: true,
  });
};
