import HomeView from "@/views/HomeView.vue";

import type { RouteRecordRaw } from "vue-router";

export const ROUTE = {
  HOME: "home",
  LOGIN: "login",

  PART_INDEX: "partIndex",
  PART_CREATE: "partCreate",
  PART_EDIT: "partEdit",

  COMPANY_INDEX: "companyIndex",
  COMPANY_CREATE: "companyCreate",
  COMPANY_EDIT: "companyEdit",
} as const;

// Ensures that `ROUTE_PATH` can only contain keys that belong in `ROUTE`
type ValidPathKey = { [k in keyof typeof ROUTE]: string };

export const ROUTE_PATH: ValidPathKey = {
  HOME: "/",
  LOGIN: "/login",

  // Part-related Routes
  PART_INDEX: "/part",
  PART_CREATE: "/part",
  PART_EDIT: "/part/:id",

  // Company-related Routes
  COMPANY_INDEX: "/companies",
  COMPANY_CREATE: "/companies/create",
  COMPANY_EDIT: "/companies/:id",
} as const;

const publicRoutes: RouteRecordRaw[] = [
  {
    path: ROUTE_PATH.LOGIN,
    name: ROUTE.LOGIN,
    component: () => import("@/views/login/LoginView.vue"),
    meta: { title: "Login" },
  },
];

const privateRoutes: RouteRecordRaw[] = [
  {
    path: ROUTE_PATH.HOME,
    name: ROUTE.HOME,
    component: HomeView,
    meta: { auth: true, title: "Parts" },
  },

  {
    path: ROUTE_PATH.PART_INDEX,
    name: ROUTE.PART_INDEX,
    component: () => import("@/views/Part/PartIndex.vue"),
    meta: { auth: true },
    children: [
      {
        path: ROUTE_PATH.PART_CREATE,
        name: ROUTE.PART_CREATE,
        component: () => import("@/views/Part/PartEdit.vue"),
        meta: { title: "Parts - Create", isCreatePage: true },
      },
      {
        path: ROUTE_PATH.PART_EDIT,
        name: ROUTE.PART_EDIT,
        component: () => import("@/views/Part/PartEdit.vue"),
        meta: { title: "Parts - Edit", isCreatePage: false },
      },
    ],
  },

  {
    path: ROUTE_PATH.COMPANY_INDEX,
    name: ROUTE.COMPANY_INDEX,
    component: () => import("@/views/Company/CompanyIndex.vue"),
    meta: { title: "Companies", auth: true },
  },
  {
    path: ROUTE_PATH.COMPANY_CREATE,
    name: ROUTE.COMPANY_CREATE,
    component: () => import("@/views/Company/CompanyEdit.vue"),
    meta: { title: "Companies - Create", isCreatePage: true },
  },
  {
    path: ROUTE_PATH.COMPANY_EDIT,
    name: ROUTE.COMPANY_EDIT,
    component: () => import("@/views/Company/CompanyEdit.vue"),
    meta: { title: "Companies - Edit", isCreatePage: false },
  },
];

const routes: RouteRecordRaw[] = [...publicRoutes, ...privateRoutes];

export default routes;
