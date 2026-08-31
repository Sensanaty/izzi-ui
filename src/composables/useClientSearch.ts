import { ref } from "vue";
import { isClientsSortField } from "@/api/clients";
import { useUrlQuery } from "@/composables/useUrlQuery";

import type { ClientsSort } from "@/api/clients";
import type { LocationQuery, LocationQueryValue } from "vue-router";

export type ClientsUrlState = { query: string; sort: ClientsSort[] };

export function useClientSearch() {
  const clientUrlQuery = useUrlQuery<ClientsUrlState>({
    parse: (query) => ({ query: queryValue(query, "query"), sort: parseSort(query.sort) }),
    serialize: (state) => ({
      query: state.query || undefined,
      sort:
        state.sort.map(({ field, direction }) => `${field}:${direction}`).join(",") || undefined,
    }),
  });

  const searchQuery = ref(clientUrlQuery.state.value.query);
  const sort = ref<ClientsSort[]>(clientUrlQuery.state.value.sort);
  const isWritingUrl = ref(false);

  async function syncQueryToUrl(): Promise<void> {
    isWritingUrl.value = true;

    try {
      await clientUrlQuery.replace({ query: searchQuery.value.trim(), sort: sort.value });
    } finally {
      isWritingUrl.value = false;
    }
  }

  function updateFromUrl(state: ClientsUrlState): void {
    searchQuery.value = state.query;
    sort.value = state.sort;
  }

  return { clientUrlQuery, isWritingUrl, searchQuery, sort, syncQueryToUrl, updateFromUrl };
}

function queryValue(query: LocationQuery, key: string): string {
  const value = query[key];

  return typeof value === "string" ? value : "";
}

function parseSort(value: LocationQueryValue | LocationQueryValue[] | undefined): ClientsSort[] {
  const serialized = Array.isArray(value) ? value[0] : value;

  return (
    serialized?.split(",").flatMap((entry) => {
      const [field, direction] = entry.split(":");

      return field && isClientsSortField(field) && (direction === "asc" || direction === "desc")
        ? [{ field, direction }]
        : [];
    }) ?? []
  );
}
