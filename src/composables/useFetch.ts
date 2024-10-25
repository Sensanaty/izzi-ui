import type { RawAxiosRequestConfig } from "axios";
import useNotificationStore from "@/stores/notification";
import { computed, ref } from "vue";
import axios, { AxiosError } from "axios";
import { storeToRefs } from "pinia";
import useAuthStore from "@/stores/auth";
import { useThrottleFn } from "@vueuse/core";

type FetchMethod = "GET" | "POST" | "DELETE" | "PUT";

type FetchConfig = Partial<{
  data: unknown;
  successMessage: string;
  skipError: boolean;
  axiosConfig: RawAxiosRequestConfig;
}>;

const useFetch = (needsAuth = true) => {
  const { createNotification } = useNotificationStore();
  const { token } = storeToRefs(useAuthStore());

  const status = ref<"idle" | "fetching" | "success" | "error">("idle");

  const isFetching = computed(() => status.value === "fetching");
  const hasErrored = computed(() => status.value === "error");
  const hasFetched = computed(() => status.value === "success" || status.value === "error");

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: needsAuth ? `Bearer ${token.value}` : null,
    },
  });

  async function fetch<T>(url: string, method: FetchMethod, config?: FetchConfig): Promise<T> {
    if (isFetching.value) {
      return Promise.reject();
    }

    status.value = "fetching";

    try {
      const response = await api<T>(url, {
        ...config?.axiosConfig,
        method,
        data: config?.data ?? null,
      });

      status.value = "success";

      if (config?.successMessage) {
        createNotification(config.successMessage, { kind: "s" });
      }

      return Promise.resolve(response.data);
    } catch (error: unknown) {
      status.value = "error";

      if (config?.skipError) {
        console.error("An error occurred:", error);
        return Promise.reject();
      }

      if (error instanceof AxiosError) {
        await handleAxiosError(error);
        return Promise.reject();
      }

      createNotification("An unknown error occurred", { kind: "w" });
      return Promise.reject();
    }
  }

  const toastError = useThrottleFn((message: string) => {
    createNotification(message, {
      kind: "w",
    });
  }, 1000);

  async function handleAxiosError(error: AxiosError<{ message: string }>) {
    if (!error?.response?.status || !error.response?.data?.message) {
      createNotification("An unknown error occurred", { kind: "w" });
      return;
    }

    const errorMessage = error.response.data.message;

    switch (error.response.status) {
      default:
        await toastError(errorMessage);
        break;
    }
  }

  return {
    isFetching,
    hasErrored,
    hasFetched,

    fetch,
  };
};

export default useFetch;
