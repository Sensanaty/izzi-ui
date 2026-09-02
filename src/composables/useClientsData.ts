import { ref, type Ref } from "vue";
import { getClients } from "@/api/clients";
import { notifyApiError } from "@/lib/notifications";

import type { ClientsSort } from "@/api/clients";
import type { PaginationMetadata } from "@/composables/usePagination";
import type { Client } from "@/lib/schemas/client";

type ClientsDataOptions = {
  page: Ref<number>;
  pageSize: Ref<number>;
  searchQuery: Ref<string>;
  sort: Ref<ClientsSort[]>;
  updatePagination: (metadata: PaginationMetadata) => void;
  onLoaded?: () => void;
};

export function useClientsData(options: ClientsDataOptions) {
  const clients = ref<Client[]>([]);

  const isLoading = ref(false);
  const errorMessage = ref<string | null>(null);

  async function loadClients(page = options.page.value): Promise<void> {
    isLoading.value = true;
    errorMessage.value = null;

    try {
      const response = await getClients({
        page,
        count: options.pageSize.value,
        query: options.searchQuery.value.trim(),
        sort: options.sort.value,
      });

      clients.value = response.data;
      options.updatePagination(response.metadata);
      options.onLoaded?.();
    } catch (error) {
      clients.value = [];

      errorMessage.value = notifyApiError(error, "Unable to load contacts", {
        skipAuthenticationErrors: true,
      }).message;
    } finally {
      isLoading.value = false;
    }
  }

  return { clients, errorMessage, isLoading, loadClients };
}
