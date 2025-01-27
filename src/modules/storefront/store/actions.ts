import $api from "@/shared/composables/useServiceAPI";
import { storeRoutes } from "./store-routes";

const nameSpace: string = "storefront";

export const createStorefront = async (payload: any) => {
  return await $api
    .setBaseAPI(nameSpace)
    .push(storeRoutes.createStorefront, { payload });
};

export const fetchStorefront = async (payload: any) => {
  return await $api
    .setBaseAPI(nameSpace)
    .fetch(`${storeRoutes.fetchStorefront}/${payload.businessId}`);
};

export const fetchStoreById = async (payload: any) => {
  return await $api
    .setBaseAPI(nameSpace)
    .fetch(`${storeRoutes.fetchStoreById}/${payload.storeId}`);
};

export const updateStorefront = async (payload: any) => {
  return await $api
    .setBaseAPI(nameSpace)
    .update(storeRoutes.updateStorefront, { payload });
};

export const deleteStorefront = async (payload: any) => {
  return await $api
    .setBaseAPI(nameSpace)
    .remove(`${storeRoutes.deleteStorefront}/${payload.storefrontId}`, {});
};

export const getStoreProducts = async (payload: any) => {
  return await $api
    .setBaseAPI(nameSpace)
    .fetch(`${storeRoutes.getProducts}?slug=${payload.storefrontSlug}`);
};

export const createStoreProduct = async (payload: any) => {
  return await $api
    .setBaseAPI(nameSpace)
    .push(storeRoutes.addProducts, { payload });
};

export const updateStoreProduct = async (payload: any) => {
  return await $api
    .setBaseAPI(nameSpace)
    .update(`${storeRoutes.editProduct}`, { payload });
};

export const deleteStoreProduct = async (payload: any) => {
  return await $api
    .setBaseAPI(nameSpace)
    .remove(`${storeRoutes.deleteProduct}/${payload.productId}`, {});
};

export const getStoreOrders = async (payload: any) => {
  return await $api
    .setBaseAPI(nameSpace)
    .fetch(`${storeRoutes.getOrders}?store_id=${payload.storefrontId}`);
};

export const updateOrderStatus = async (payload: any) => {
  return await $api
    .setBaseAPI(nameSpace)
    .update(`${storeRoutes.updateOrderStatus}`, { payload });
};
