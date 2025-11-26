import $api from "@/shared/composables/useServiceAPI";
import { paymentRoutes } from "./payment-routes";

export const getTransactions = async (payload: any) => {
  return await $api.fetch(`${paymentRoutes.getPaymentTransactions}?page=${payload.page}`, {
    resolve: true,
    requiresPublicKey: true,
  });
};

export const getAllTransactions = async (payload: any) => {
  return await $api.fetch(`${paymentRoutes.getPaymentTransactions}?limit=100000`, {
    resolve: true,
    requiresPublicKey: true,
  });
};

export const getSingleTransaction = async (payload: any) => {
  return await $api.fetch(`${paymentRoutes.getTransactionByRef}/${payload.ref}`, {
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
export const requestRefund = async (payload: any) => {
  return await $api.push(paymentRoutes.requestRefund, {
    payload,
    requiresPublicKey: true,
  });
};

export const getPayouts = async (payload: any) => {
  return await $api.fetch(`${paymentRoutes.getAllPayouts}?page=${payload.page}`, {
    resolve: true,
    requiresPublicKey: true,
  });
};

export const fetchAllPayouts = async () => {
  return await $api.fetch(`${paymentRoutes.getAllPayouts}?limit=100000`, {
    resolve: true,
    requiresPublicKey: true,
  });
};
