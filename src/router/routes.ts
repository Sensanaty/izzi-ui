import HomeView from "@/views/HomeView.vue";

import type { RouteRecordRaw } from "vue-router";

export const ROUTE = {
  HOME: "home",
  CONTACT: "contact",
  LOGIN: "login",
  ADMIN: "admin",
} as const;

// Ensures that `ROUTE_PATH` can only contain keys that belong in `ROUTE`
type ValidPathKey = { [k in keyof typeof ROUTE]: string };

export const ROUTE_PATH: ValidPathKey = {
  HOME: "/",
  CONTACT: "/contact",
  LOGIN: "/login",
  ADMIN: "/admin",
} as const;

const publicRoutes: RouteRecordRaw[] = [
  {
    path: ROUTE_PATH.HOME,
    name: ROUTE.HOME,
    component: HomeView,
  },
  {
    path: ROUTE_PATH.CONTACT,
    name: ROUTE.CONTACT,
    component: () => import("@/views/ContactView.vue"),
  },
  {
    path: ROUTE_PATH.LOGIN,
    name: ROUTE.LOGIN,
    component: () => import("@/views/login/LoginView.vue"),
  },
];

const privateRoutes: RouteRecordRaw[] = [];

const routes: RouteRecordRaw[] = [...publicRoutes, ...privateRoutes];

export default routes;
