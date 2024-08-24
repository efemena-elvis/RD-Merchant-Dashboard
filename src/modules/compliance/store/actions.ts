import $api from "@/shared/composables/useServiceAPI";
import { complianceRoutes } from "./compliance-routes";

export const getCompliance = async () => {
  return await $api.fetch(complianceRoutes.getCompliance);
};

export const uploadCompliance = async (payload: any) => {
  return await $api.push(complianceRoutes.uploadCompliance, {
    payload,
  });
};

export const activateBusiness = async (payload: any) => {
  return await $api.push(
    `${complianceRoutes.activateBusiness}/${payload.complianceId}`,
    {}
  );
};
