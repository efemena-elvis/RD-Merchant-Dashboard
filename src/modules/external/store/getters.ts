import { computed } from "vue";
import { paymentDetails, customerDetails } from "./state";

export const getPaymentDetails = computed(() => paymentDetails.value);
export const getCustomerDetails = computed(() => customerDetails.value);
