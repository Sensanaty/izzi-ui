import type { NavigationGuard } from "vue-router";
import useAuthApi from "@/api/auth";
import useAuthStore from "@/stores/auth";
import { ROUTE_PATH } from "@/router/routes";
import useNotificationStore from "@/stores/notification";
import { useHead } from "@unhead/vue";
import { useRouter } from "vue-router";

export const authMiddleware: NavigationGuard = async (to, from, next) => {
  // Check if only query parameters changed (same path and name)
  const isOnlyQueryChanged = to.path === from.path && to.name === from.name;

  if (to.meta.auth && !isOnlyQueryChanged) {
    const authStore = useAuthStore();
    const { createNotification } = useNotificationStore();

    if (!authStore.token && !localStorage.getItem("token")) {
      authStore.logout();

      createNotification("No authorization token found, please log in again", { kind: "i" });
      return next(ROUTE_PATH.LOGIN);
    }

    // Allow navigation to proceed
    next();

    // Perform authentication check in the background
    const { authenticate } = useAuthApi();
    const router = useRouter();
    authenticate(true)
      .then((payload) => {
        authStore.setAuthFromLocal();
        if (payload.token) {
          authStore.setToken(payload.token);
        }
      })
      .catch(() => {
        createNotification("Authorization failed, please login again", { kind: "i" });
        authStore.logout();

        router.push(ROUTE_PATH.LOGIN);
      });
  } else {
    next();
  }
};

export const metaMiddleware: NavigationGuard = async (to, _from, _next) => {
  if (to.meta?.title) {
    useHead({ title: to.meta.title });
  }
};
