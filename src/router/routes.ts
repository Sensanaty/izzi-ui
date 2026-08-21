import { Route, RoutePath } from "@/router/constants.ts";

import type { RouteRecordRaw } from "vue-router";

const publicRoutes: RouteRecordRaw[] = [
  {
    path: RoutePath.HOME,
    name: Route.HOME,
    component: () => import("@/views/HomeView.vue"),
    meta: { title: "Home" },
  },
] as const;

const privateRoutes: RouteRecordRaw[] = [] as const;

export const routes: RouteRecordRaw[] = [...publicRoutes, ...privateRoutes];
