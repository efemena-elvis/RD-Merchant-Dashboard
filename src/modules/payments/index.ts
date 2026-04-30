import { IRouteType } from "@/models/route-type";

const paymentRoutes: IRouteType[] = [
  {
    path: "/payments",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/base-layout.vue"),
    children: [
      {
        path: "transactions",
        name: "RedstoneTransactions",
        component: () =>
          import(
            /* webpackChunkName: "payment-module" */ "@/modules/payments/pages/transactions.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Transactions",
          pageMeta: {
            title: "Merchant Transactions",
            description: "Explore and manage your transactions in one place",
          },
        },
      },

      {
        path: "customers",
        name: "RedstoneCustomers",
        component: () =>
          import(
            /* webpackChunkName: "payment-module" */ "@/modules/payments/pages/customers.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Customers",
          pageMeta: {
            title: "Merchant Customers",
            description: "View and connect with all your customers",
          },
        },
      },

      {
        path: "refunds",
        name: "RedstoneRefunds",
        component: () =>
          import(
            /* webpackChunkName: "payment-module" */ "@/modules/payments/pages/refunds.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Refunds",
          pageMeta: {
            title: "Transaction Refunds",
            description: "Explore all your transaction refunds",
          },
        },
      },

      {
        path: "payouts",
        name: "RedstonePayouts",
        component: () =>
          import(
            /* webpackChunkName: "payment-module" */ "@/modules/payments/pages/payouts.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Payouts",
          pageMeta: {
            title: "Transaction Payouts",
            description: "View and manage all your transaction payouts",
          },
        },
      },

      {
        path: "disputes",
        name: "RedstoneDisputes",
        component: () =>
          import(
            /* webpackChunkName: "payment-module" */ "@/modules/payments/pages/disputes.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Disputes",
          pageMeta: {
            title: "Dispute Payments",
            description:
              "View all and resolve all dispute related transactions",
          },
        },
      },
    ],
  },
];

export default paymentRoutes;
