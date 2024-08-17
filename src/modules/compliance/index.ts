import { IRouteType } from "@/models/route-type";

const complianceRoutes: IRouteType[] = [
  {
    path: "/compliance",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/base-layout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(
            /* webpackChunkName: "compliance-layout" */ "@/modules/compliance/layouts/compliance-layout.vue"
          ),
        children: [
          {
            path: "documents",
            name: "RedstoneDocuments",
            component: () =>
              import(
                /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/documents.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Compliance documents",
              pageMeta: {
                title: "Compliance Documents",
                description: "View all required business compliance documents",
                basePath: "Documents",
                basePathIcon: "icon-file",
              },
            },
          },

          {
            path: "business-profile",
            name: "RedstoneBusinessProfile",
            component: () =>
              import(
                /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/business-profile.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Business Profile",
              pageMeta: {
                title: "Business Information",
                description: "Manage your business address and contact details",
                basePath: "Merchant Business",
                basePathIcon: "icon-building",
              },
            },
          },

          {
            path: "business-contact",
            name: "RedstoneBusinessContact",
            component: () =>
              import(
                /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/business-contact.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Business Contact",
              pageMeta: {
                title: "Business Information",
                description: "Manage your business address and contact details",
                basePath: "Merchant Business",
                basePathIcon: "icon-building",
              },
            },
          },

          {
            path: "business-address",
            name: "RedstoneBusinessAddress",
            component: () =>
              import(
                /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/business-address.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Business Address",
              pageMeta: {
                title: "Business Information",
                description: "Manage your business address and contact details",
                basePath: "Merchant Business",
                basePathIcon: "icon-building",
              },
            },
          },

          {
            path: "business-confirm",
            name: "RedstoneBusinessConfirm",
            component: () =>
              import(
                /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/business-confirm.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Business Verify",
              pageMeta: {
                title: "Business Information",
                description: "Manage your business address and contact details",
                basePath: "Merchant Business",
                basePathIcon: "icon-building",
              },
            },
          },

          {
            path: "registration-information",
            name: "RedstoneRegistrationInformation",
            component: () =>
              import(
                /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/registration-information.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Business Registration",
              pageMeta: {
                title: "Business Registration",
                description:
                  "Manage your business document registration details",
                basePath: "Merchant Business Registration",
                basePathIcon: "icon-shop",
              },
            },
          },

          {
            path: "registration-confirm",
            name: "RedstoneRegistrationConfirm",
            component: () =>
              import(
                /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/registration-confirm.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Verify Registration",
              pageMeta: {
                title: "Business Registration",
                description:
                  "Manage your business document registration details",
                basePath: "Merchant Business Registration",
                basePathIcon: "icon-shop",
              },
            },
          },

          {
            path: "representative-profile",
            name: "RedstoneRepresentativeProfile",
            component: () =>
              import(
                /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/representative-profile.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Business Representative Profile",
              pageMeta: {
                title: "Business Representative",
                description:
                  "Manage your business registered representative identity",
                basePath: "Merchant Representative",
                basePathIcon: "icon-profile-users",
              },
            },
          },

          {
            path: "representative-identity",
            name: "RedstoneRepresentativeIdentity",
            component: () =>
              import(
                /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/representative-identity.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Business Representative Identity",
              pageMeta: {
                title: "Business Representative",
                description:
                  "Manage your business registered representative identity",
                basePath: "Merchant Representative",
                basePathIcon: "icon-profile-users",
              },
            },
          },

          {
            path: "representative-address",
            name: "RedstoneRepresentativeAddress",
            component: () =>
              import(
                /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/representative-address.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Business Representative Address",
              pageMeta: {
                title: "Business Representative",
                description:
                  "Manage your business registered representative identity",
                basePath: "Merchant Representative",
                basePathIcon: "icon-profile-users",
              },
            },
          },

          {
            path: "representative-confirm",
            name: "RedstoneRepresentativeConfirm",
            component: () =>
              import(
                /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/representative-confirm.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Business Representative Verify",
              pageMeta: {
                title: "Business Representative",
                description:
                  "Manage your business registered representative identity",
                basePath: "Merchant Representative",
                basePathIcon: "icon-profile-users",
              },
            },
          },

          {
            path: "bank-account",
            name: "RedstoneBankAccount",
            component: () =>
              import(
                /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/bank-account.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Business Account",
              pageMeta: {
                title: "Business Account",
                description: "Manage your business bank account details",
                basePath: "Merchant Bank Account",
                basePathIcon: "icon-bank",
              },
            },
          },

          {
            path: "signatory-profile",
            name: "RedstoneSignatoryProfile",
            component: () =>
              import(
                /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/signatory-profile.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Signatory Profile",
              pageMeta: {
                title: "Business Signatory",
                description: "Manage your business signatory identity",
                basePath: "Merchant Business Signatory",
                basePathIcon: "icon-user",
              },
            },
          },

          {
            path: "signatory-identity",
            name: "RedstoneSignatoryIdentity",
            component: () =>
              import(
                /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/signatory-identity.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Signatory Identity",
              pageMeta: {
                title: "Business Signatory",
                description: "Manage your business signatory identity",
                basePath: "Merchant Business Signatory",
                basePathIcon: "icon-user",
              },
            },
          },

          {
            path: "signatory-address",
            name: "RedstoneSignatoryAddress",
            component: () =>
              import(
                /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/signatory-address.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Signatory Address",
              pageMeta: {
                title: "Business Signatory",
                description: "Manage your business signatory identity",
                basePath: "Merchant Business Signatory",
                basePathIcon: "icon-user",
              },
            },
          },

          {
            path: "signatory-confirm",
            name: "RedstoneSignatoryConfirm",
            component: () =>
              import(
                /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/signatory-confirm.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Signatory Verify",
              pageMeta: {
                title: "Business Signatory",
                description: "Manage your business signatory identity",
                basePath: "Merchant Business Signatory",
                basePathIcon: "icon-user",
              },
            },
          },

          {
            path: "agreement-signature",
            name: "RedstoneAgreementSignature",
            component: () =>
              import(
                /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/agreement-signature.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Agreement Signature",
              pageMeta: {
                title: "Terms & Agreement",
                description:
                  "Access and review our service terms and agreement",
                basePath: "Terms & Agreement",
                basePathIcon: "icon-document-text",
              },
            },
          },

          {
            path: "compliance-summary",
            name: "RedstoneComplianceSummary",
            component: () =>
              import(
                /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/summary.vue"
              ),
            meta: {
              requiresAuth: true,
              title: "Compliance Summary",
              pageMeta: {
                title: "Compliance Summary",
                description:
                  "Review all completed and pending compliance verifications",
                basePath: "Merchant Compliance Summary",
                basePathIcon: "icon-directbox-notif",
              },
            },
          },
        ],
      },
    ],
  },
];

export default complianceRoutes;
