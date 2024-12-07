import HomeView from "@/views/HomeView.vue";

import type { RouteRecordRaw } from "vue-router";

export const ROUTE = {
  HOME: "home",
  LOGIN: "login",

  PART_INDEX: "partIndex",
  PART_CREATE: "partCreate",
  PART_EDIT: "partEdit",
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
    component: import("@/views/Part/PartIndex.vue"),
    meta: { auth: true },
    children: [
      {
        path: ROUTE_PATH.PART_CREATE,
        name: ROUTE.PART_CREATE,
        component: import("@/views/PartEdit.vue"),
        meta: { title: "Parts - Create", isCreatePage: true },
      },
      {
        path: ROUTE_PATH.PART_EDIT,
        name: ROUTE.PART_EDIT,
        component: import("@/views/PartEdit.vue"),
        meta: { title: "Parts - Edit", isCreatePage: false },
      },
    ],
  },
];

const routes: RouteRecordRaw[] = [...publicRoutes, ...privateRoutes];

export default routes;
