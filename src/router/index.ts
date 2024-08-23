import { createRouter, createWebHistory } from "vue-router";
import middlewares from "@/middlewares";

// IMPORTED ROUTES FROM RESPECTIVE APPLICATION MODULES
import authRoutes from "@/modules/auth";
import complianceRoutes from "@/modules/compliance";
import dashboardRoutes from "@/modules/overview";
import paymentRoutes from "@/modules/payments";
import transferRoutes from "@/modules/transfers";
import settingsRoutes from "@/modules/settings";
import externalRoutes from "@/modules/external";

const routes = [
  ...authRoutes,
  ...complianceRoutes,
  ...dashboardRoutes,
  ...paymentRoutes,
  ...transferRoutes,
  ...settingsRoutes,
  ...externalRoutes,
  {
    path: "/*",
    name: "NotFoundError",
    component: () =>
      import(
        /* webpackChunkName: "errorRoute" */
        "@/modules/error/pages/not-found.vue"
      ),
    meta: {
      guest: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    } else if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

// =============================================================
// WRAPPING OUR APPLICATION ENTRY POINTS INSIDE OUR MIDDLEWARE
// TO VERIFY A USER AUTHENTICATION STATE AND AUTHORIZATION
// =============================================================
router.beforeEach(async (to, from, next) => middlewares(to, from, next));
export default router;
