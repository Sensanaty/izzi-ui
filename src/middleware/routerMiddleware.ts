import type { NavigationGuard } from "vue-router";
import useAuthApi from "@/api/auth";
import useAuthStore from "@/stores/auth";
import { ROUTE_PATH } from "@/router/routes";
import useNotificationStore from "@/stores/notification";
import { useHead } from "@unhead/vue";

export const authMiddleware: NavigationGuard = async (to, _from, next) => {
  const authStore = useAuthStore();
  const { createNotification } = useNotificationStore();

  if (to.meta.auth) {
    if (!authStore.token && !localStorage.getItem("token")) {
      authStore.logout();
      next(ROUTE_PATH.LOGIN);

      createNotification("No authorization token found, please log in again", { kind: "i" });
    } else {
      const { authenticate } = useAuthApi();

      authenticate(true).then((payload) => {
        authStore.setAuthFromLocal();

        if (payload.token) {
          authStore.setToken(payload.token);
        }

        next();
      }).catch(() => {
        createNotification("Authorization failed, please login again", { kind: "i" });

        authStore.logout();
        next(ROUTE_PATH.LOGIN);
      });
    }
  } else {
    next();
  }
};

export const metaMiddleware: NavigationGuard = async (to, _from, _next) => {
  if (to.meta?.title) {
    useHead({ title: to.meta.title });
  }
};
