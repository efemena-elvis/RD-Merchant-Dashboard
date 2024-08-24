import $api from "@/shared/composables/useServiceAPI";
import { settingsRoutes } from "./settings-routes";

export const getAuditLogs = async () => {
  return await $api.fetch(settingsRoutes.auditLogs, {
    resolve: true,
    requiresPublicKey: true,
  });
};
