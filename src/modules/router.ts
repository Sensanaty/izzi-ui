import { createRouter, createWebHistory } from "vue-router";

import Home from "~/pages/index.vue";
import Login from "~/pages/login/index.vue";

const publicRoutes = [
  { path: "/", name: "Home", component: Home },
  { path: "/login", name: "Login", component: Login },
  { path: "/about", name: "About", component: () => import("../pages/about/index.vue") }
];

const authRoutes = [
  { path: "/admin", name: "AdminHome", component: () => import("../pages/admin/index.vue"), meta: { auth: true } },
  { path: "/admin/:partId/edit", name: "PartEdit", component: () => import("../pages/admin/parts/Edit.vue"), meta: { auth: true } },
  { path: "/admin/new", name: "PartNew", component: () => import("../pages/admin/parts/New.vue"), meta: { auth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes: [...publicRoutes, ...authRoutes]
});

export default router;
