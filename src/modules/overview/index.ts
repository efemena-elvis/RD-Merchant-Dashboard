import { IRouteType } from "@/models/route-type";

const dashboardRoutes: IRouteType[] = [
  {
    path: "/overview",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/base-layout.vue"),
    children: [
      {
        path: "",
        name: "RedstoneOverview",
        component: () =>
          import(
            /* webpackChunkName: "dashboard-module" */ "@/modules/overview/pages/overview.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Overview",
          pageMeta: {
            title: "Dashboard Overview",
            description:
              "Welcome to Redstone PGS. Let's power up your business!",
          },
        },
      },
    ],
  },


//    {
//     path: "/overview",
//     component: () =>
//       import(/* webpackChunkName: "base-layout" */ "@/layouts/base-layout.vue"),
//     children: [
//       {
//         path: "",
//         name: "RedstoneOverview",
//         component: () =>
//           import(
//                   /* webpackChunkName: "transfer-module" */ "@/modules/transfers/pages/balance.vue"
//           ),
//         meta: {
//           requiresAuth: true,
//           title: "Overview",
//           pageMeta: {
//             title: "Dashboard Overview",
//             description:
//               "Welcome to Redstone PGS. Let's power up your business! View your recent transactions here.",
//           },
//         },
//       },
//     ],
//   },
];

export default dashboardRoutes;
