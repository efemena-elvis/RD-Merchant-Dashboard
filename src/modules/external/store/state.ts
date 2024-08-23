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
