import { computed, readonly, ref } from "vue";
import { defineStore } from "pinia";
import { api, getApiErrorDetails, type ApiErrorDetails } from "@/lib/api";
import { developmentCredentials } from "@/lib/developmentAuth";
import { authenticationResponseSchema } from "@/lib/schemas/auth";
import { emptyResponseSchema } from "@/lib/schemas/common";

import type { User } from "@/lib/schemas/user";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(null);
  const isInitialized = ref(false);
  const isLoading = ref(false);
  const error = ref<ApiErrorDetails | null>(null);

  let initializationPromise: Promise<void> | null = null;
  let accessTokenRefreshPromise: Promise<boolean> | null = null;

  const isAuthenticated = computed(() => user.value !== null && accessToken.value !== null);
  const isAdmin = computed(() => user.value?.admin ?? false);
  const canAutoLogin = computed(() => developmentCredentials !== null);
  const isInitializing = computed(() => isLoading.value && !isInitialized.value);

  const setError = (exception: unknown): void => {
    error.value = getApiErrorDetails(exception, "An unexpected authentication error occurred");
  };

  const clearAuth = (): void => {
    user.value = null;
    accessToken.value = null;
  };

  async function refreshAccessToken(): Promise<boolean> {
    accessTokenRefreshPromise ??= (async () => {
      try {
        const authentication = await api.post(
          "/auth/refresh",
          undefined,
          authenticationResponseSchema,
          { requiresAuth: false, skipRefresh: true },
        );

        user.value = authentication.user;
        accessToken.value = authentication.token;
        error.value = null;

        return true;
      } catch (exception: unknown) {
        clearAuth();
        const errorDetails = getApiErrorDetails(
          exception,
          "An unexpected authentication error occurred",
        );

        error.value = errorDetails;

        return false;
      } finally {
        accessTokenRefreshPromise = null;
      }
    })();

    return accessTokenRefreshPromise;
  }

  async function restoreSession(): Promise<void> {
    if (isInitialized.value) {
      return;
    }

    initializationPromise ??= (async () => {
      isLoading.value = true;
      error.value = null;
      await refreshAccessToken();
      isInitialized.value = true;
      isLoading.value = false;
    })();

    await initializationPromise;
  }

  async function login(username: string, password: string): Promise<boolean> {
    isLoading.value = true;
    error.value = null;

    try {
      const authentication = await api.post(
        "/auth/login",
        { username, password },
        authenticationResponseSchema,
        { requiresAuth: false, skipRefresh: true },
      );
      user.value = authentication.user;
      accessToken.value = authentication.token;

      return true;
    } catch (error: unknown) {
      clearAuth();
      setError(error);

      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function autoLogin(): Promise<boolean> {
    if (!developmentCredentials) {
      return false;
    }

    return login(developmentCredentials.username, developmentCredentials.password);
  }

  async function logout(): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      await api.post("/auth/logout", undefined, emptyResponseSchema, {
        requiresAuth: false,
        skipRefresh: true,
      });
    } catch (error: unknown) {
      setError(error);
    } finally {
      clearAuth();
      isLoading.value = false;
    }
  }

  return {
    user: readonly(user),
    accessToken: readonly(accessToken),
    isInitialized: readonly(isInitialized),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Computeds

    isAuthenticated,
    isAdmin,
    canAutoLogin,
    isInitializing,

    // Actions

    login,
    autoLogin,
    restoreSession,
    refreshAccessToken,
    logout,
    clearAuth,
  };
});
