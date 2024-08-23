import $api from "@/shared/composables/useServiceAPI";
import { useExternalMutations } from "./mutations";
import { externalRoutes } from "./external-routes";
import { IAPIType } from "@/models/api-type";

export function useExternalActions() {
  const { mutatePaymentDetails } = useExternalMutations();

  const fetchPaymentDetails = async ({
    paymentReference,
  }: any): Promise<IAPIType> => {
    const response: any = await $api.fetch(
      `${externalRoutes.getPaymentDetails}/${paymentReference}`
    );

    response?.code === 200 && mutatePaymentDetails(response?.data || {});
    return response;
  };

  const makePayment = async ({ paymentReference, customerDetails }: any) => {
    return await $api.push(
      `${externalRoutes.makePayment}/${paymentReference}`,
      { payload: customerDetails }
    );
  };

  return {
    fetchPaymentDetails,
    makePayment,
  };
}
