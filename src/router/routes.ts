import { Route, RoutePath } from "@/router/constants.ts";

import type { RouteRecordRaw } from "vue-router";

export type RouteMeta = {
  requiresAuth: boolean;
  requiresAdmin?: boolean;
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
  {
    path: RoutePath.COMPANIES,
    name: Route.COMPANIES,
    component: () => import("@/views/CompaniesView.vue"),
    meta: { requiresAuth: true, title: "Companies" } satisfies RouteMeta,
  },
  {
    path: RoutePath.COMPANY_NEW,
    name: Route.COMPANY_NEW,
    component: () => import("@/views/CompanyFormView.vue"),
    meta: { requiresAuth: true, title: "New company" } satisfies RouteMeta,
  },
  {
    path: RoutePath.COMPANY_EDIT,
    name: Route.COMPANY_EDIT,
    component: () => import("@/views/CompanyFormView.vue"),
    meta: { requiresAuth: true, title: "Edit company" } satisfies RouteMeta,
  },
  {
    path: RoutePath.USERS,
    name: Route.USERS,
    component: () => import("@/views/UsersView.vue"),
    meta: { requiresAuth: true, requiresAdmin: true, title: "Users" } satisfies RouteMeta,
  },
  {
    path: RoutePath.USER_NEW,
    name: Route.USER_NEW,
    component: () => import("@/views/UserFormView.vue"),
    meta: { requiresAuth: true, requiresAdmin: true, title: "New user" } satisfies RouteMeta,
  },
  {
    path: RoutePath.USER_EDIT,
    name: Route.USER_EDIT,
    component: () => import("@/views/UserFormView.vue"),
    meta: { requiresAuth: true, requiresAdmin: true, title: "Edit user" } satisfies RouteMeta,
  },
];

export const routes: RouteRecordRaw[] = appRoutes;
