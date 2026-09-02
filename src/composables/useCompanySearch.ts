import { ref } from "vue";
import { isCompaniesSortField } from "@/api/companies";
import { useUrlQuery } from "@/composables/useUrlQuery";

import type { CompaniesSort } from "@/api/companies";
import type { LocationQuery, LocationQueryValue } from "vue-router";

export type CompaniesUrlState = {
  query: string;
  sort: CompaniesSort[];
};

export function useCompanySearch() {
  const companyUrlQuery = useUrlQuery<CompaniesUrlState>({
    parse: (query) => ({
      query: queryValue(query, "query"),
      sort: parseSort(query.sort),
    }),
    serialize: (state) => ({
      query: state.query || undefined,
      sort:
        state.sort.map(({ field, direction }) => `${field}:${direction}`).join(",") || undefined,
    }),
  });

  const searchQuery = ref(companyUrlQuery.state.value.query);
  const sort = ref<CompaniesSort[]>(companyUrlQuery.state.value.sort);
  const isWritingUrl = ref(false);

  async function syncQueryToUrl(): Promise<void> {
    isWritingUrl.value = true;

    try {
      await companyUrlQuery.replace({ query: searchQuery.value.trim(), sort: sort.value });
    } finally {
      isWritingUrl.value = false;
    }
  }

  function updateFromUrl(state: CompaniesUrlState): void {
    searchQuery.value = state.query;
    sort.value = state.sort;
  }

  return { companyUrlQuery, isWritingUrl, searchQuery, sort, syncQueryToUrl, updateFromUrl };
}

function queryValue(query: LocationQuery, key: string): string {
  const value = query[key];

  return typeof value === "string" ? value : "";
}

function parseSort(value: LocationQueryValue | LocationQueryValue[] | undefined): CompaniesSort[] {
  const serialized = Array.isArray(value) ? value[0] : value;

  if (!serialized) return [];

  return serialized.split(",").flatMap((entry) => {
    const [field, direction] = entry.split(":");

    if (!field || !isCompaniesSortField(field)) return [];
    if (direction !== "asc" && direction !== "desc") return [];

    return [{ field, direction }];
  });
}
