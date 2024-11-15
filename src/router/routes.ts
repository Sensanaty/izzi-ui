import HomeView from "@/views/HomeView.vue";

import type { RouteRecordRaw } from "vue-router";

export const ROUTE = {
  HOME: "home",
  LOGIN: "login",
} as const;

// Ensures that `ROUTE_PATH` can only contain keys that belong in `ROUTE`
type ValidPathKey = { [k in keyof typeof ROUTE]: string };

export const ROUTE_PATH: ValidPathKey = {
  HOME: "/",
  LOGIN: "/login",
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
];

const routes: RouteRecordRaw[] = [...publicRoutes, ...privateRoutes];

export default routes;
