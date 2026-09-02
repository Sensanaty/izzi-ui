import { computed, ref } from "vue";
import { useUrlQuery } from "@/composables/useUrlQuery";
import { parsePartsConditions, parsePartsSort } from "@/lib/partsSearch";

import type { PartsCondition, PartsSort } from "@/api/parts";
import type { LocationQuery } from "vue-router";

export type PartsUrlState = {
  conditions: PartsCondition[];
  partNumber: string;
  sort: PartsSort[];
};

export function usePartsSearch() {
  const partsUrlQuery = useUrlQuery<PartsUrlState>({
    parse: (query) => ({
      conditions: parsePartsConditions(query.conditions),
      partNumber: queryValue(query, "part_number"),
      sort: parsePartsSort(query.sort),
    }),

    serialize: (state) => ({
      conditions: state.conditions.length ? JSON.stringify(state.conditions) : undefined,
      part_numbers: undefined,
      part_number: state.partNumber || undefined,
      description: undefined,
      company_id: undefined,
      condition: undefined,
      quote_type: undefined,
      available_min: undefined,
      available_max: undefined,
      min_price_min: undefined,
      min_price_max: undefined,
      sort:
        state.sort.map(({ field, direction }) => `${field}:${direction}`).join(",") || undefined,
    }),
  });

  const searchQuery = ref(partsUrlQuery.state.value.partNumber);
  const conditions = ref<PartsCondition[]>(partsUrlQuery.state.value.conditions);
  const sort = ref<PartsSort[]>(partsUrlQuery.state.value.sort);
  const isAdvancedSearchOpen = ref(conditions.value.length > 0);
  const isAdvancedSearchLoaded = ref(isAdvancedSearchOpen.value);
  const isWritingUrl = ref(false);
  const advancedSearchKey = computed(() => JSON.stringify(conditions.value));

  async function syncQueryToUrl(): Promise<void> {
    isWritingUrl.value = true;

    try {
      await partsUrlQuery.replace({
        conditions: conditions.value,
        partNumber: searchQuery.value.trim(),
        sort: sort.value,
      });
    } finally {
      isWritingUrl.value = false;
    }
  }

  function updateFromUrl(state: PartsUrlState): void {
    searchQuery.value = state.partNumber;
    conditions.value = state.conditions;
    sort.value = state.sort;
    isAdvancedSearchOpen.value = state.conditions.length > 0;

    if (isAdvancedSearchOpen.value) isAdvancedSearchLoaded.value = true;
  }

  return {
    advancedSearchKey,
    conditions,
    isAdvancedSearchLoaded,
    isAdvancedSearchOpen,
    isWritingUrl,
    partsUrlQuery,
    searchQuery,
    sort,
    syncQueryToUrl,
    updateFromUrl,
  };
}

function queryValue(query: LocationQuery, key: string): string {
  const value = query[key];

  return typeof value === "string" ? value : "";
}
