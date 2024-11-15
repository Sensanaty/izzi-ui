import { computed, ref } from "vue";

import type { PaginationMetadata } from "@/composables/useFetch";

const emptyMetadata = {
  count: 0,
  from: 1,
  last: 1,
  next: null,
  page: 1,
  prev: null,
  to: 1,
  total: 0,
} satisfies PaginationMetadata;

const usePagination = () => {
  const metadata = ref<PaginationMetadata>(structuredClone(emptyMetadata));

  function setMetadata(payload: PaginationMetadata) {
    metadata.value = payload;
  }

  function clearMetadata() {
    metadata.value = structuredClone(emptyMetadata);
  }

  return {
    metadata,

    total: computed(() => metadata.value?.total ?? 0),
    currentPage: computed(() => metadata.value?.page ?? 1),
    lastPage: computed(() => metadata.value?.last ?? 1),
    hasPreviousPage: computed(() => metadata.value?.prev !== null),
    hasNextPage: computed(() => metadata.value?.next !== null),
    hasMetadata: computed(() => metadata.value !== null),

    setMetadata,
    clearMetadata,
  };
};

export default usePagination;
