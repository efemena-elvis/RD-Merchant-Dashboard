import $api from "@/shared/composables/useServiceAPI";
import { storeRoutes } from "./store-routes";

const nameSpace: string = "storefront";

export const createStorefront = async (payload: any) => {
  return await $api.push(storeRoutes.createStorefront, {
    payload,
    resolve: true,
    requiresPublicKey: true,
  });
};

export const fetchStorefront = async () => {
  return await $api.fetch(storeRoutes.fetchStorefront, {
    resolve: true,
    requiresPublicKey: true,
  });
};

export const fetchStoreById = async (payload: any) => {
  return await $api.fetch(`${storeRoutes.fetchStoreById}/${payload.storeId}`, {
    resolve: true,
    requiresPublicKey: true,
  });
};

export const updateStorefront = async (payload: any) => {
  return await $api.update(storeRoutes.updateStorefront, {
    payload,
    resolve: true,
    requiresPublicKey: true,
  });
};

export const deleteStorefront = async (payload: any) => {
  return await $api.remove(
    `${storeRoutes.deleteStorefront}/${payload.storefrontId}`,
    { resolve: true, requiresPublicKey: true }
  );
};

export const getStoreProducts = async (payload: any) => {
  return await $api.fetch(
    `${storeRoutes.getProducts}?slug=${payload.storefrontSlug}`,
    {
      resolve: true,
      requiresPublicKey: true,
    }
  );
};

export const createStoreProduct = async (payload: any) => {
  return await $api.push(storeRoutes.addProducts, {
    payload,
    resolve: true,
    requiresPublicKey: true,
  });
};

export const updateStoreProduct = async (payload: any) => {
  return await $api.update(storeRoutes.editProduct, {
    payload,
    resolve: true,
    requiresPublicKey: true,
  });
};

export const deleteStoreProduct = async (payload: any) => {
  return await $api.remove(
    `${storeRoutes.deleteProduct}/${payload.productId}`,
    { requiresPublicKey: true }
  );
};

export const getStoreOrders = async (payload: any) => {
  return await $api.fetch(`${storeRoutes.getOrders}/${payload.storefrontId}`, {
    resolve: true,
    requiresPublicKey: true,
  });
};

export const updateOrderStatus = async (payload: any) => {
  return await $api.update(`${storeRoutes.updateOrderStatus}`, {
    payload,
    resolve: true,
    requiresPublicKey: true,
  });
};

export const viewOrderDetails = async (payload: any) => {
  return await $api.fetch(
    `${storeRoutes.viewOrderDetails}/${payload.orderId}`,
    { resolve: true, requiresPublicKey: true }
  );
};


export const lookUpDomain = async (payload: any) => {
  return await $api.push(
      storeRoutes.checkDomain
    , {
      payload,
      resolve: true,
      requiresPublicKey: true
    }
  )
}


export const initiateDomainPayment = async (payload: any) => {
  return await $api.push(storeRoutes.initiateDomainPayment, 
    {
      payload,
      resolve: true,
      requiresPublicKey: true
    })
};