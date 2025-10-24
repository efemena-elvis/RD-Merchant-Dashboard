import $api from "@/shared/composables/useServiceAPI";
import { paymentRoutes } from "./payment-routes";

export const getTransactions = async (payload: any) => {
  return await $api.fetch(`${paymentRoutes.getPaymentTransactions}?page=${payload.page}`, {
    resolve: true,
    requiresPublicKey: true,
  });
};

export const getCustomers = async (payload: any) => {
  return await $api.fetch(`${paymentRoutes.getCustomers}?page=${payload.page}`, {
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

export const fetchAllPayouts = async (payload: any) => {
  return await $api.fetch(`${paymentRoutes.getAllPayouts}?page=${payload.page}`, {
    resolve: true,
    requiresPublicKey: true,
  });
};
