import useNotificationStore from "@/stores/notification";
import { computed, ref } from "vue";
import axios, { AxiosError } from "axios";
import { storeToRefs } from "pinia";
import useAuthStore from "@/stores/auth";
import { useThrottleFn } from "@vueuse/core";

import type { AxiosRequestConfig, RawAxiosRequestConfig } from "axios";

type FetchMethod = "GET" | "POST" | "DELETE" | "PUT";

type FetchConfig = Partial<{
  data: unknown;
  successMessage: string;
  skipError: boolean;
  params: RawAxiosRequestConfig["params"];
  axiosConfig: RawAxiosRequestConfig;
}>;

interface DownloadConfig extends Omit<FetchConfig, "data"> {
  filename?: string;
  responseType?: "blob" | "arraybuffer";
  contentType?: string;
}

export type PaginationMetadata = {
  page: number;
  prev: number | null;
  next: number | null;
  last: number;
  from: number;
  to: number;
  count: number;
  total: number;
};

export type PaginatedResponse<T> = {
  data: T;
  metadata: PaginationMetadata;
  token?: string;
};

export interface CommonPaginationParams {
  page?: number;
  count?: number;
}

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
      const queryConfig: AxiosRequestConfig = {
        ...config?.axiosConfig,
        method,
      };

      if (config?.data) queryConfig["data"] = config.data;
      if (config?.params) queryConfig["params"] = config.params;

      const response = await api<T & { token?: string }>(url, queryConfig);

      if (response?.data?.token) {
        useAuthStore().setToken(response.data.token);
      }

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

  async function downloadFile(downloadUrl: string, config?: DownloadConfig): Promise<void> {
    if (isFetching.value) {
      return Promise.reject();
    }

    status.value = "fetching";

    try {
      const queryConfig: AxiosRequestConfig = {
        ...config?.axiosConfig,
        method: "GET",
        responseType: config?.responseType || "blob",
        params: config?.params,
      };

      if (config?.contentType) {
        queryConfig.headers = {
          ...queryConfig.headers,
          "Accept": config.contentType,
        };
      }

      const response = await api(downloadUrl, queryConfig);

      let filename = config?.filename;
      const contentDisposition = response.headers["content-disposition"];

      if (!filename && contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      if (!filename) {
        filename = "download";

        // Try to add extension based on content-type
        const contentType = response.headers["content-type"];

        if (contentType?.includes("csv")) {
          filename += ".csv";
        } else {
          filename += ".txt";
        }
      }

      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      if (config?.successMessage) {
        createNotification(config.successMessage, { kind: "s" });
      }

      status.value = "success";

      return Promise.resolve();
    } catch (error: unknown) {
      status.value = "error";

      if (config?.skipError) {
        console.error("An error occurred during download:", error);
        return Promise.reject();
      }

      if (error instanceof AxiosError) {
        // Check if the error response is JSON that we can parse
        if (error.response?.data instanceof Blob &&
          error.response.headers["content-type"]?.includes("application/json")) {

          // Convert Blob to text to read the error message
          const text = await error.response.data.text();
          try {
            error.response.data = JSON.parse(text);
            await handleAxiosError(error);
          } catch (e) {
            createNotification("Failed to download file", { kind: "w" });
          }
        } else {
          await handleAxiosError(error);
        }

        return Promise.reject();
      }

      createNotification("An unknown error occurred during download", { kind: "w" });
      return Promise.reject();
    }
  }

  const toastError = useThrottleFn((message: string) => {
    createNotification(message, {
      kind: "w",
    });
  }, 1000);

  async function handleAxiosError(error: AxiosError<{ error: string }>) {
    if (!error?.response?.status || !error.response?.data?.error) {
      createNotification("An unknown error occurred", { kind: "w" });
      return;
    }

    const errorMessage = error.response.data.error;

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
    downloadFile,
  };
};

export default useFetch;
