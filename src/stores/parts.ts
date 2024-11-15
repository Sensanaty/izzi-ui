import { ref } from "vue";
import { defineStore } from "pinia";
import extractDefaults from "@/utils/zodUtils";
import useFetch, {
  type PaginatedResponse,
  type CommonPaginationParams,
} from "@/composables/useFetch";
import { PartSchema, type Part, type CreatePart, type UpdatePart } from "@/schemas";
import usePagination from "@/composables/usePagination";

export interface PartsQueryParams extends CommonPaginationParams {
  // Search string to search by Part ID
  query?: string;
}

const PART_URL = "/parts";
const PART_ID_URL = (id: number | bigint) => `${PART_URL}/${id}`;

export const usePartsStore = defineStore("parts", () => {
  const { metadata, total, currentPage, lastPage, hasPreviousPage, hasNextPage, hasMetadata, setMetadata, clearMetadata } = usePagination();
  const { fetch, isFetching, hasErrored, hasFetched } = useFetch();

  const parts = ref<Part[]>([]);
  const currentPart = ref<Part>(extractDefaults(PartSchema));
  const currentParams = ref<PartsQueryParams>({ page: 1, count: 20 });

  async function getAllParts(params: PartsQueryParams) {
    currentParams.value = params;

    const response = await fetch<PaginatedResponse<Part[]>>(PART_URL, "GET", { params });
    parts.value = response.data;
    setMetadata(response.metadata);
  }

  async function getPage(page: number) {
    let correctedPage = page;

    if (page <= 0) {
      correctedPage = 1;
    } else if (page > metadata.value?.last) {
      correctedPage = metadata.value.last;
    }

    await getAllParts({ ...currentParams.value, page: correctedPage });
  }

  async function getFirstPage() {
    if (hasPreviousPage.value) await getPage(1);
  }

  async function getLastPage() {
    if (hasNextPage.value) await getPage(metadata.value.last);
  }

  async function getNextPage() {
    if (hasNextPage.value && metadata.value?.next) await getPage(metadata.value.next);
  }

  async function getPreviousPage() {
    if (hasPreviousPage.value && metadata.value?.prev) await getPage(metadata.value.prev);
  }

  async function getPart(id: Part["id"]) {
    const response = await fetch<Part>(PART_ID_URL(id), "GET");
    currentPart.value = response;
  };

  function clearCurrentPart() {
    currentPart.value = extractDefaults(PartSchema);
  }

  async function createPart(data: CreatePart) {
    await fetch<Part>(PART_URL, "POST", { data, successMessage: "Part created" });
  }

  async function updatePart(id: UpdatePart["id"], data: UpdatePart) {
    const response = await fetch<Part>(PART_ID_URL(id), "PUT", { data, successMessage: "Part updated" });

    if (response.id === currentPart.value?.id) currentPart.value = response;
  }

  async function deletePart(id: Part["id"]) {
    await fetch(PART_ID_URL(id), "DELETE", { successMessage: "Part deleted" });
  };

  function reset() {
    parts.value = [];
    currentPart.value = extractDefaults(PartSchema);
    clearMetadata();
    currentParams.value = { page:1, count: 20 };
  }

  return {
    parts,
    currentPart,
    metadata,
    currentParams,

    isFetching,
    hasErrored,
    hasFetched,

    total,
    currentPage,
    lastPage,
    hasPreviousPage,
    hasNextPage,
    hasMetadata,

    getAllParts,
    getPage,
    getFirstPage,
    getLastPage,
    getNextPage,
    getPreviousPage,
    getPart,
    clearCurrentPart,
    createPart,
    updatePart,
    deletePart,
    reset,
  };
});

export default usePartsStore;
