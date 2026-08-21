import { Route, RoutePath } from "@/router/constants.ts";
import { useAuthStore } from "@/stores/auth.ts";

import type { RouteLocationNormalizedGeneric } from "vue-router";

export async function authMiddleware(to: RouteLocationNormalizedGeneric) {
  const auth = useAuthStore();
  await auth.restoreSession();

  if (to.meta?.requiresAuth && !auth.isAuthenticated) {
    if (to.path === RoutePath.LOGIN) {
      return true;
    }

    return {
      name: Route.LOGIN,
      query: { redirect: to.fullPath },
    };
  }

  if (to.name === Route.LOGIN && auth.isAuthenticated) {
    return { name: Route.HOME };
  }

  return true;
}
