import { createRouter, createWebHistory, RouteLocation } from "vue-router";
import Home from "~/pages/index.vue";
import Login from "~/pages/login/index.vue";

const publicRoutes = [
  { path: "/", name: "Home", component: Home },
  {
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: (to: RouteLocation) => {
      if (window.localStorage.getItem("token")) {
        return "/admin";
      } else {
        return to.fullPath;
      }
    }
  }
];

const authRoutes = [
  { path: "/admin", name: "AdminHome", component: () => import("../pages/admin/index.vue"), meta: { auth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes: [...publicRoutes, ...authRoutes]
});

export default router;
