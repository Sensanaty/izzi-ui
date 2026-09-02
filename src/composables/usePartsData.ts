import { ref, type Ref } from "vue";
import { getParts } from "@/api/parts";
import { notifyApiError } from "@/lib/notifications";

import type { PartsCondition, PartsSort } from "@/api/parts";
import type { PaginationMetadata } from "@/composables/usePagination";
import type { Part } from "@/lib/schemas/part";

type PartsDataOptions = {
  page: Ref<number>;
  pageSize: Ref<number>;
  searchQuery: Ref<string>;
  conditions: Ref<PartsCondition[]>;
  sort: Ref<PartsSort[]>;
  updatePagination: (metadata: PaginationMetadata) => void;
  onLoaded?: () => void;
};

export function usePartsData(options: PartsDataOptions) {
  const parts = ref<Part[]>([]);

  const isLoading = ref(false);
  const errorMessage = ref<string | null>(null);

  async function loadParts(page = options.page.value): Promise<void> {
    isLoading.value = true;
    errorMessage.value = null;

    try {
      const response = await getParts({
        page,
        count: options.pageSize.value,
        query: options.searchQuery.value.trim(),
        conditions: options.conditions.value,
        sort: options.sort.value,
      });
      parts.value = response.data;
      options.updatePagination(response.metadata);
      options.onLoaded?.();
    } catch (error) {
      parts.value = [];
      errorMessage.value = notifyApiError(error, "Unable to load parts", {
        skipAuthenticationErrors: true,
      }).message;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    errorMessage,
    isLoading,
    loadParts,
    parts,
  };
}
