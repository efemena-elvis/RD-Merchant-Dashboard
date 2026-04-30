import { IRouteType } from "@/models/route-type";

const settingsRoutes: IRouteType[] = [
  {
    path: "/settings",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/base-layout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(
            /* webpackChunkName: "settings-layout" */ "@/modules/settings/layouts/settings-layout.vue"
          ),
        children: [
          {
            path: "profile",
            name: "RedstoneProfileSettings",
            component: () =>
              import(
                /* webpackChunkName: "settings-module" */ "@/modules/settings/pages/profile.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Profile Settings",
              pageMeta: {
                title: "Profile Settings",
                description:
                  "Manage and customize your account profile settings",
                basePath: "Manage User Profile",
                basePathIcon: "icon-user",
              },
            },
          },

          {
            path: "password",
            name: "RedstonePasswordSettings",
            component: () =>
              import(
                /* webpackChunkName: "settings-module" */ "@/modules/settings/pages/password.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Password Settings",
              pageMeta: {
                title: "Password Settings",
                description: "Manage your account password",
                basePath: "Manage User Password",
                basePathIcon: "icon-security-safe",
              },
            },
          },

          {
            path: "accounts",
            name: "RedstoneAccountSettings",
            component: () =>
              import(
                /* webpackChunkName: "settings-module" */ "@/modules/settings/pages/accounts.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Account Settings",
              pageMeta: {
                title: "Account Settings",
                description: "Manage your settlement business accounts",
                basePath: "Update Bank Account",
                basePathIcon: "icon-bank",
              },
            },
          },

          {
            path: "contacts",
            name: "RedstoneContactSettings",
            component: () =>
              import(
                /* webpackChunkName: "settings-module" */ "@/modules/settings/pages/contact.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Contact Settings",
              pageMeta: {
                title: "Contact Settings",
                description: "Manage all your business contacts information",
                basePath: "Manage Contact Details",
                basePathIcon: "icon-profile-users",
              },
            },
          },

          {
            path: "preferences",
            name: "RedstonePreferenceSettings",
            component: () =>
              import(
                /* webpackChunkName: "settings-module" */ "@/modules/settings/pages/preferences.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Preferences Settings",
              pageMeta: {
                title: "Account Preferences",
                description: "Manage all your account preferences",
                basePath: "Account Preferences",
                basePathIcon: "icon-tool",
              },
            },
          },

          {
            path: "developers",
            name: "RedstoneDeveloperSettings",
            component: () =>
              import(
                /* webpackChunkName: "settings-module" */ "@/modules/settings/pages/developers.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Developer Settings",
              pageMeta: {
                title: "Developer Settings",
                description: "View and manage all your developer setup",
                basePath: "Configure API Setup",
                basePathIcon: "icon-developer",
              },
            },
          },
        ],
      },

      {
        path: "/user-support",
        name: "RedstoneSupport",
        component: () =>
          import(
            /* webpackChunkName: "settings-module" */ "@/modules/settings/pages/support.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Help & Support",
          pageMeta: {
            title: "Help & Support",
            description: "Access all our help and support channels",
          },
        },
      },

      {
        path: "/notifications",
        name: "RedstoneNotifications",
        component: () =>
          import(
            /* webpackChunkName: "settings-module" */ "@/modules/settings/pages/notifications.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Notifications",
          pageMeta: {
            title: "Merchant transactions",
            description: "View all merchant transactions",
          },
        },
      },

      {
        path: "/activity-logs",
        name: "RedstoneActivityLogs",
        component: () =>
          import(
            /* webpackChunkName: "settings-module" */ "@/modules/settings/pages/activity-logs.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Activity Logs",
          pageMeta: {
            title: "Merchant Activity Logs",
            description:
              "View all transaction activities initiated on your account",
          },
        },
      },
    ],
  },
];

export default settingsRoutes;
