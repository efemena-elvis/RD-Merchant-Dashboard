import $api from "@/shared/composables/useServiceAPI";
import { paymentRoutes } from "./payment-routes";

export const getTransactions = async () => {
  return await $api.fetch(paymentRoutes.getPaymentTransactions);
};
