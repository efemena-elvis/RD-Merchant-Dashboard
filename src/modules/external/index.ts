import { IRouteType } from "@/models/route-type";

// *********** REDSTONE EXTERNAL ROUTES *********** //
const externalRoutes: IRouteType[] = [
  {
    path: "/checkout/:paymentReference",
    name: "RedstoneCollectionCheckout",
    component: () =>
      import(
        /* webpackChunkName: "external-module" */ "@/modules/external/pages/collection-checkout.vue"
      ),
    meta: {
      open: true,
      title: "Payment Collections",
    },
  },

  {
    path: "/checkout/:paymentReference/:status",
    name: "RedstoneCollectionCheckoutStatus",
    component: () =>
      import(
        /* webpackChunkName: "external-module" */ "@/modules/external/pages/collection-checkout-status.vue"
      ),
    meta: {
      open: true,
      title: "Payment Collections",
    },
  },
  {
    path: "/checkout/check",
    name: "RedstoneCheckoutStatus",
    component: () =>
      import(
        /* webpackChunkName: "external-module" */ "@/modules/external/pages/collection-check.vue"
      ),
    meta: {
      open: true,
      title: "Payment Collections",
    },
  },
];

export default externalRoutes;
