import $api from "@/shared/composables/useServiceAPI";
import { generalRoutes } from "./general-routes";

export function useGeneralActions() {
  const uploadFile = async (payload: any) => {
    const response: any = await $api.push(generalRoutes.fileUpload, {
      payload,
      is_attach: true,
    });
    return response;
  };

  return {
    uploadFile,
  };
}
