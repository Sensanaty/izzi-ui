import { createRouter, createWebHistory } from "vue-router";
import { authMiddleware } from "@/router/middleware/authMiddleware.ts";
import { routes } from "@/router/routes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(authMiddleware);

export default router;
