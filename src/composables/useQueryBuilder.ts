import { useRoute, useRouter, type LocationQuery } from "vue-router";

import type { Ref } from "vue";
import { toRaw, watch } from "vue";

type QueryFilters = { [key: string]: string | number | undefined };

// Makes all properties of T optional while preserving their types
type OptionalFilters<T> = {
  [K in keyof T]?: T[K]
};

export default function useQueryBuilder<T extends QueryFilters>(filters: Ref<T>) {
  const originalValues = structuredClone(toRaw(filters.value));

  const route = useRoute();
  const router = useRouter();

  watch(filters, (newFilters) => {
    const query: LocationQuery = { ...route.query };

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === originalValues[key] || value === undefined || value === "") {
        delete query[key];
      } else {
        query[key] = value.toString();
      }
    });

    router.replace({ query });
  }, { deep: true });

  const getCurrentQueryParams = () => {
    const params = {} as OptionalFilters<T>;

    Object.entries(route.query).forEach(([key, value]) => {
      if (key in originalValues) {
        const typedKey = key as keyof T;

        if (typeof originalValues[typedKey] === "number") {
          params[typedKey] = Number(value) as T[keyof T];
        } else {
          params[typedKey] = value as T[keyof T];
        }
      }
    });

    return params;
  };

  return { getCurrentQueryParams };
};
