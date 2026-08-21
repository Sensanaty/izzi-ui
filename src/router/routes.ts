import { Route, RoutePath } from "@/router/constants.ts";

import type { RouteRecordRaw } from "vue-router";

export type RouteMeta = {
  requiresAuth: boolean;
  title?: string;
};

const appRoutes: RouteRecordRaw[] = [
  {
    path: RoutePath.LOGIN,
    name: Route.LOGIN,
    component: () => import("@/views/LoginView.vue"),
    meta: { requiresAuth: false, title: "Sign in" } satisfies RouteMeta,
  },
  {
    path: RoutePath.HOME,
    name: Route.HOME,
    component: () => import("@/views/HomeView.vue"),
    meta: { requiresAuth: true, title: "Home" } satisfies RouteMeta,
  },
];

export const routes: RouteRecordRaw[] = appRoutes;
