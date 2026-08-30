import { computed, ref } from "vue";

export type PaginationMetadata = {
  page: number;
  last: number;
  total: number;
};

type PaginationOptions = {
  pageSizeOptions: readonly number[];
  storageKey?: string;
  defaultPageSize?: number;
};

export function usePagination(options: PaginationOptions) {
  const pageSizeOptions = [...options.pageSizeOptions];
  const pageSize = ref(getInitialPageSize(options));
  const pageInput = ref(1);
  const currentPage = ref(1);
  const lastPage = ref(1);
  const totalItems = ref(0);
  const hasPreviousPage = computed(() => currentPage.value > 1);
  const hasNextPage = computed(() => currentPage.value < lastPage.value);

  function updateMetadata(metadata: PaginationMetadata): void {
    currentPage.value = metadata.page;
    pageInput.value = metadata.page;
    lastPage.value = metadata.last;
    totalItems.value = metadata.total;
  }

  function getBoundedPage(page: number): number {
    return Math.min(Math.max(Math.trunc(page), 1), lastPage.value);
  }

  function setPageSize(size: number): void {
    if (!pageSizeOptions.includes(size)) return;

    pageSize.value = size;

    if (options.storageKey) localStorage.setItem(options.storageKey, String(size));
  }

  return {
    currentPage,
    getBoundedPage,
    hasNextPage,
    hasPreviousPage,
    lastPage,
    pageInput,
    pageSize,
    pageSizeOptions,
    setPageSize,
    totalItems,
    updateMetadata,
  };
}

function getInitialPageSize(options: PaginationOptions): number {
  const defaultPageSize = options.defaultPageSize ?? options.pageSizeOptions[0] ?? 1;

  const storedPageSize = options.storageKey
    ? Number(localStorage.getItem(options.storageKey))
    : NaN;

  return options.pageSizeOptions.includes(storedPageSize) ? storedPageSize : defaultPageSize;
}
