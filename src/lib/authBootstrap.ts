import { configureApiAuth } from "@/lib/api";
import { Route } from "@/router/constants";
import { useAuthStore } from "@/stores/auth";

import type { Pinia } from "pinia";
import type { Router } from "vue-router";

export const initializeAuth = (pinia: Pinia, router: Router): void => {
  const auth = useAuthStore(pinia);

  configureApiAuth({
    getAccessToken: () => auth.accessToken,
    initializeAuth: auth.restoreSession,
    refreshAccessToken: auth.refreshAccessToken,
    onRefreshFailure: () => {
      auth.clearAuth();

      if (auth.isInitialized && router.currentRoute.value.name !== Route.LOGIN) {
        void router.push({
          name: Route.LOGIN,
          query: { redirect: router.currentRoute.value.fullPath },
        });
      }
    },
  });

  void auth.restoreSession();
};
