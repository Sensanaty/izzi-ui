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
  {
    path: RoutePath.PART_NEW,
    name: Route.PART_NEW,
    component: () => import("@/views/PartFormView.vue"),
    meta: { requiresAuth: true, title: "Create part" } satisfies RouteMeta,
  },
  {
    path: RoutePath.PART_EDIT,
    name: Route.PART_EDIT,
    component: () => import("@/views/PartFormView.vue"),
    meta: { requiresAuth: true, title: "Edit part" } satisfies RouteMeta,
  },
];

export const routes: RouteRecordRaw[] = appRoutes;
