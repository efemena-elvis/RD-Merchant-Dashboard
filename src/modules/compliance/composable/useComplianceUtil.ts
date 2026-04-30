import { ref } from "vue";
import useEvents from "@/shared/composables/useEvents";
import { useComplianceStore } from "../store";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

export function useComplianceUtil() {
  const router = useRouter();
  const timeOut = ref<number>(1200);

  const { processAPIRequest } = useEvents();
  const { uploadCompliance } = useComplianceStore();

  const {
    getComplianceBusiness,
    getComplianceRegistration,
    getComplianceRepresentative,
    getComplianceBankAccount,
    getComplianceBusinessSignatory,
    getComplianceAgreement,
  } = storeToRefs(useComplianceStore());

  const getRequestPayload = ({
    businessPayload = {},
    registrationPayload = {},
    representativePayload = {},
    bankPayload = {},
    signatoryPayload = {},
    termsPayload = {},
  }: any) => {
    return {
      business: { ...getComplianceBusiness.value, ...businessPayload.value },
      registration: {
        ...getComplianceRegistration.value,
        ...registrationPayload.value,
      },
      representatives: [
        {
          ...(getComplianceRepresentative.value?.[0] || {}),
          ...representativePayload.value,
        },
      ],
      bank_account: { ...getComplianceBankAccount.value, ...bankPayload.value },
      business_signatory: {
        ...getComplianceBusinessSignatory.value,
        ...signatoryPayload.value,
      },
      terms: { ...getComplianceAgreement.value, ...termsPayload.value },
    };
  };

  const getRequestAlertHandler = (successMsg: string, errorMsg: string) => {
    return {
      200: {
        message: successMsg,
        type: "success",
      },
      400: {
        message: errorMsg,
        type: "error",
      },
    };
  };

  const processComplianceRedirect = ({
    responsePayload,
    stopClickHandler,
    redirectRoute,
  }: any) => {
    if (responsePayload.code === 200) {
      stopClickHandler.value = true;
      setTimeout(() => router.push({ name: redirectRoute }), timeOut.value);
    }
    // ON FAILED UPDATE STOP PROCESSING
    else stopClickHandler.value = true;
  };

  const selectPayload = (
    payload: any,
    payloadType:
      | "business"
      | "registration"
      | "representatives"
      | "bank_account"
      | "business_signatory"
      | "terms"
  ) => {
    const payloadBucket = {
      business: {
        businessPayload: payload,
      },
      registration: {
        registrationPayload: payload,
      },
      representatives: {
        representativePayload: payload,
      },
      bank_account: {
        bankPayload: payload,
      },
      business_signatory: {
        signatoryPayload: payload,
      },
      terms: {
        termsPayload: payload,
      },
    };

    return payloadBucket[payloadType];
  };

  const handleComplianceRequest = async ({
    payload,
    redirectRoute,
    stopClickHandler,
    succesMsg,
    errorMsg,
    payloadType,
  }: any) => {
    const response = await processAPIRequest({
      action: uploadCompliance,
      payload: getRequestPayload(selectPayload(payload, payloadType)),
      alertHandler: getRequestAlertHandler(succesMsg, errorMsg),
    });

    processComplianceRedirect({
      responsePayload: response,
      stopClickHandler,
      redirectRoute,
    });
  };

  return {
    handleComplianceRequest,
  };
}
