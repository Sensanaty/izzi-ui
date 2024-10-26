import { createRouter, createWebHistory } from "vue-router";
import routes from "@/router/routes";
import { authMiddleware } from "@/middleware/authMiddleware";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  authMiddleware(to, from, next);
});

export default router;
