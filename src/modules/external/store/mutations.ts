import {
  paymentDetails,
  customerDetails,
  cardPaymentContext,
  cardPaymentForm,
} from "./state";

export function useExternalMutations() {
  const mutatePaymentDetails = (responsePayload: any) => {
    paymentDetails.value = responsePayload;
  };

  const mutateCustomerDetails = (responsePayload: any) => {
    const { full_name, email, phone_number } = responsePayload;

    customerDetails.value = {
      account_number: phone_number,
      customer_first_name: full_name?.split(" ")[0] || "",
      customer_last_name: full_name?.split(" ")[1] || "",
      method: "mobilemoney",
      phone_number,
      email,
    };
  };

  const mutateCardPaymentContext = (context: string) => {
    cardPaymentContext.value = context;
  };

  const mutateCardPaymentForm = (form: any) => {
    cardPaymentForm.value = form;
  };

  return {
    mutatePaymentDetails,
    mutateCustomerDetails,
    mutateCardPaymentContext,
    mutateCardPaymentForm,
  };
}
