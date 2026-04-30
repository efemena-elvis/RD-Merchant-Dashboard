import $api from "@/shared/composables/useServiceAPI";
import { useExternalMutations } from "./mutations";
import { externalRoutes } from "./external-routes";
import { IAPIType } from "@/models/api-type";

export function useExternalActions() {
  const { mutatePaymentDetails, mutateCardPaymentContext } =
    useExternalMutations();

  const fetchPaymentDetails = async ({
    paymentReference,
  }: any): Promise<IAPIType> => {
    const response: any = await $api.fetch(
      `${externalRoutes.getPaymentDetails}/${paymentReference}`
    );

    response?.code === 200 && mutatePaymentDetails(response?.data || {});
    return response;
  };

  const fetchCardPaymentContext = async (payload: any) => {
    return await $api.push(externalRoutes.generateCardContext, {
      requiresPublicKey: true,
      resolve: true,
      payload,
    });
  };

  const makePayment = async ({ paymentReference, customerDetails }: any) => {
    return await $api.push(
      `${externalRoutes.makePayment}/${paymentReference}`,
      { payload: customerDetails }
    );
  };

  const continuePayment = async ({ paymentReference }: any) => {
    return await $api.push(
      `${externalRoutes.continuePayment}/${paymentReference}/continue`,
      {}
    );
  };

  return {
    fetchPaymentDetails,
    makePayment,
    fetchCardPaymentContext,
    continuePayment,
  };
}
