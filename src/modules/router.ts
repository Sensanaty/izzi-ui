import { createRouter, createWebHistory } from "vue-router";
import Home from "~/pages/index.vue";

const publicRoutes = [
  { path: "/", name: "Home", component: Home }
];

const authRoutes = [
  { path: "/admin", name: "AdminHome", component: () => import("../pages/admin/index.vue"), meta: { auth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes: [...publicRoutes, ...authRoutes]
});

export default router;
