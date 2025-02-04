import $api from "@/shared/composables/useServiceAPI";
import { storeRoutes } from "./store-routes";

const nameSpace: string = "storefront";

export const createStorefront = async (payload: any) => {
  return await $api.push(storeRoutes.createStorefront, { payload });
};

export const fetchStorefront = async () => {
  return await $api.fetch(storeRoutes.fetchStorefront);
};

export const fetchStoreById = async (payload: any) => {
  return await $api.fetch(`${storeRoutes.fetchStoreById}/${payload.storeId}`);
};

export const updateStorefront = async (payload: any) => {
  return await $api.update(storeRoutes.updateStorefront, { payload });
};

export const deleteStorefront = async (payload: any) => {
  return await $api.remove(
    `${storeRoutes.deleteStorefront}/${payload.storefrontId}`,
    {}
  );
};

export const getStoreProducts = async (payload: any) => {
  return await $api.fetch(
    `${storeRoutes.getProducts}?slug=${payload.storefrontSlug}`
  );
};

export const createStoreProduct = async (payload: any) => {
  return await $api.push(storeRoutes.addProducts, { payload });
};

export const updateStoreProduct = async (payload: any) => {
  return await $api.update(storeRoutes.editProduct, { payload });
};

export const deleteStoreProduct = async (payload: any) => {
  return await $api.remove(
    `${storeRoutes.deleteProduct}/${payload.productId}`,
    {}
  );
};

export const getStoreOrders = async (payload: any) => {
  return await $api.fetch(`${storeRoutes.getOrders}/${payload.storefrontId}`);
};

export const updateOrderStatus = async (payload: any) => {
  return await $api.update(`${storeRoutes.updateOrderStatus}`, { payload });
};

export const viewOrderDetails = async (payload: any) => {
  return await $api.fetch(`${storeRoutes.viewOrderDetails}/${payload.orderId}`);
};
