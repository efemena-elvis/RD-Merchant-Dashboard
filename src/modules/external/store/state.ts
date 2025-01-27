import type { PaymentMethods } from "@/models/api-type";
import { ref } from "vue";

type ICustomerDetails = {
  account_number: string;
  customer_first_name: string;
  customer_last_name: string;
  phone_number: string;
  email: string;
  method: string;
};

export const paymentDetails = ref<any>({});
export const customerDetails = ref<ICustomerDetails>();
export const paymentMethod = ref<PaymentMethods>();
export const cardPaymentContext = ref<string | null>(null);
export const cardPaymentForm = ref<any>(null);
export const cardNumberInput = ref<any>(null);
export const cardSecurityInput = ref<any>(null);
