import { IRouteType } from "@/models/route-type";

// *********** REDSTONE AUTHENTICATED ROUTES *********** //
const authRoutes: IRouteType[] = [
  {
    path: "/login",
    alias: "/",
    component: () =>
      import(
        /* webpackChunkName: "auth-layout" */ "@/modules/auth/layouts/auth-layout.vue"
      ),
    children: [
      // *********** REDSTONE LOGIN *********** //
      {
        path: "",
        name: "RedstoneLogin",
        component: () =>
          import(
            /* webpackChunkName: "auth-module" */ "@/modules/auth/pages/login.vue"
          ),
        meta: {
          guest: true,
          title: "Login",
        },
      },
      {
        path: "/create-account",
        name: "RedstoneCreateAccount",
        component: () =>
          import(
            /* webpackChunkName: "auth-module" */ "@/modules/auth/pages/create-account.vue"
          ),
        meta: {
          guest: true,
          title: "Create Account",
        },
      },
      {
        path: "/password-request",
        name: "RedstonePasswordRequest",
        component: () =>
          import(
            /* webpackChunkName: "auth-module" */ "@/modules/auth/pages/password-request.vue"
          ),
        meta: {
          guest: true,
          title: "Password Request",
        },
      },
      {
        path: "/password-reset",
        name: "RedstonePasswordReset",
        component: () =>
          import(
            /* webpackChunkName: "auth-module" */ "@/modules/auth/pages/password-reset.vue"
          ),
        meta: {
          guest: true,
          title: "Password Reset",
        },
      },
    ],
  },
];

export default authRoutes;
