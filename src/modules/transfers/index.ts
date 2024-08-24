import { IRouteType } from "@/models/route-type";

const transferRoutes: IRouteType[] = [
  {
    path: "/transfers",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/base-layout.vue"),
    children: [
      {
        path: "all-transfers",
        name: "RedstoneTransfers",
        component: () =>
          import(
            /* webpackChunkName: "transfer-module" */ "@/modules/transfers/pages/transfers.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "All transfers",
          pageMeta: {
            title: "Fund Transfers",
            description:
              "Initiate new transfers and manage all existing business transfers",
          },
        },
      },

      {
        path: "recipients",
        name: "RedstoneRecipients",
        component: () =>
          import(
            /* webpackChunkName: "transfer-module" */ "@/modules/transfers/pages/recipients.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Recipients",
          pageMeta: {
            title: "Transfer Recipients",
            description: "View and manage all your customer's transfer details",
          },
        },
      },

      {
        path: "balance",
        name: "RedstoneBalance",
        component: () =>
          import(
            /* webpackChunkName: "transfer-module" */ "@/modules/transfers/pages/balance.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Balance",
          pageMeta: {
            title: "Balance History",
            description: "Access your balance history till date",
          },
        },
      },
    ],
  },
];

export default transferRoutes;
