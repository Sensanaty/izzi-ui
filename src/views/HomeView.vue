<template>
  <h1 class="mb-2 font-bold text-3xl">Parts</h1>

  <div class="flex flex-col gap-2 sm:flex-row sm:items-start">
    <form class="flex flex-col gap-2 sm:flex-row" @submit.prevent="searchParts">
      <div class="w-full sm:max-w-sm">
        <IzziInput
          id="part-search"
          v-model="searchQuery"
          aria-label="Search parts"
          placeholder="Search parts"
          :autofocus="!isAdvancedSearchOpen && !conditions.length"
          type="search"
          clearable
          @clear="searchParts"
        />
      </div>

      <IzziButton type="submit" class="my-auto" :disabled="isLoading">Search</IzziButton>
    </form>

    <details
      class="border-border rounded-sm border p-3"
      :open="isAdvancedSearchOpen"
      @toggle="handleAdvancedSearchToggle"
    >
      <summary class="cursor-pointer font-bold">Advanced search</summary>

      <AdvancedPartSearch
        v-if="isAdvancedSearchLoaded"
        ref="advancedSearch"
        :key="advancedSearchKey"
        :autofocus="isAdvancedSearchOpen"
        :initial-conditions="conditions"
        @apply="applyAdvancedConditions"
      />
    </details>

    <PartsColumnSettings
      :column-options="columnOptions"
      :pinned-columns="pinnedColumns"
      :visible-columns="visibleColumns"
      @change-pinned-column="changePinnedColumn"
      @compact-widths="compactColumnWidths"
      @reset-settings="resetColumnSettings"
      @toggle-column="toggleColumn"
    />
  </div>

  <p v-if="errorMessage" class="text-danger" role="alert">{{ errorMessage }}</p>

  <div class="flex flex-wrap items-center gap-2" aria-label="Part actions">
    <IzziButton
      size="sm"
      variant="secondary"
      :disabled="!selectedParts.length || isLoading"
      @click="copySelectedDetails('quote')"
    >
      Copy quote details
    </IzziButton>

    <IzziButton
      size="sm"
      variant="secondary"
      :disabled="!selectedParts.length || isLoading"
      @click="copySelectedDetails('full')"
    >
      Copy full details
    </IzziButton>

    <IzziButton
      size="sm"
      variant="secondary"
      :disabled="!selectedParts.length || isLoading || isExporting"
      @click="exportSelectedParts"
    >
      Export selected CSV
    </IzziButton>

    <IzziButton
      size="sm"
      variant="danger"
      :disabled="!selectedParts.length || isLoading || isDeleting"
      @click="requestBulkDelete"
    >
      Delete selected
    </IzziButton>

    <IzziButton
      size="sm"
      variant="secondary"
      :disabled="isLoading || isExporting"
      @click="exportAllParts"
    >
      Export all CSV
    </IzziButton>

    <span v-if="actionMessage" class="text-text-muted text-sm" role="status">
      {{ actionMessage }}
    </span>
  </div>

  <DeleteConfirmationModal
    v-if="deleteItems.length"
    item-label="part"
    item-label-plural="parts"
    :items="deleteItems"
    :deleting="isDeleting"
    @cancel="deleteItems = []"
    @confirm="confirmDelete"
  />

  <PartDetailsSidebar
    v-if="selectedPartId !== null"
    v-model="isPartSidebarOpen"
    :part-id="selectedPartId"
  />

  <PartsGrid
    :column-defs="columnDefs"
    :default-col-def="defaultColDef"
    :is-grid-ready="isGridReady"
    :loading="isLoading"
    :modules="gridModules"
    :parts="parts"
    :row-selection="rowSelection"
    :selection-column-def="selectionColumnDef"
    :theme="gridTheme"
    :current-page="currentPage"
    :last-page="lastPage"
    :page-input="pageInput"
    :page-size="pageSize"
    :page-size-options="pageSizeOptions"
    :selected-part-count="selectedPartCount"
    :total-parts="totalParts"
    :has-previous-page="hasPreviousPage"
    :has-next-page="hasNextPage"
    @change-page-size="changePageSize"
    @go-to-page="goToPage"
    @update:page-input="pageInput = $event"
    @column-moved="persistColumnState"
    @column-pinned="persistColumnState"
    @column-resized="persistColumnState"
    @column-visible="persistColumnState"
    @cell-clicked="handleCellClicked"
    @grid-ready="handleGridReady"
    @keydown="handleGridKeydown"
    @selection-changed="handleSelectionChanged"
    @sort-changed="handleSortChanged"
  />
</template>

<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  nextTick,
  onMounted,
  ref,
  useTemplateRef,
  watch,
} from "vue";
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColumnApiModule,
  ColumnAutoSizeModule,
  colorSchemeDark,
  colorSchemeLight,
  CsvExportModule,
  ModuleRegistry,
  RowAutoHeightModule,
  RowSelectionModule,
  themeQuartz,
} from "ag-grid-community";
import { useRoute, useRouter } from "vue-router";
import { deletePart, exportParts, isPartsSortField } from "@/api/parts";
import PartDetailsSidebar from "@/components/parts/PartDetailsSidebar.vue";
import PartsGrid from "@/components/parts/PartsGrid.vue";
import IzziButton from "@/components/ui/IzziButton.vue";
import IzziInput from "@/components/ui/IzziInput.vue";
import { usePagination } from "@/composables/usePagination";
import { usePartsCopy } from "@/composables/usePartsCopy";
import { usePartsData } from "@/composables/usePartsData";
import { usePartsGrid } from "@/composables/usePartsGrid";
import { usePartsSearch } from "@/composables/usePartsSearch";
import { useTheme } from "@/composables/useTheme";
import { notifyApiError } from "@/lib/notifications";
import {
  columnOptions,
  createPartsColumnDefs,
  defaultColDef,
  selectionColumnDef,
} from "@/lib/partsGrid";

import type { PartsCondition } from "@/api/parts";
import type { Part } from "@/lib/schemas/part";
import type { CellClickedEvent, SelectionChangedEvent, SortChangedEvent } from "ag-grid-community";

const gridModules = [
  CellStyleModule,
  ClientSideRowModelModule,
  ColumnApiModule,
  ColumnAutoSizeModule,
  CsvExportModule,
  RowAutoHeightModule,
  RowSelectionModule,
];
ModuleRegistry.registerModules(gridModules);

const PartsColumnSettings = defineAsyncComponent(
  () => import("@/components/parts/PartsColumnSettings.vue"),
);
const AdvancedPartSearch = defineAsyncComponent(
  () => import("@/components/parts/AdvancedPartSearch.vue"),
);

type AdvancedPartSearchInstance = {
  focusLastUnfilledField: () => void;
};
const DeleteConfirmationModal = defineAsyncComponent(
  () => import("@/components/ui/DeleteConfirmationModal.vue"),
);

const route = useRoute();
const router = useRouter();
const selectedPartId = computed(() => {
  const value = route.query.part;
  const parsed = typeof value === "string" ? Number(value) : NaN;

  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
});
const isPartSidebarOpen = computed({
  get: () => selectedPartId.value !== null,
  set: (isOpen: boolean) => {
    if (!isOpen) void router.replace({ query: { ...route.query, part: undefined } });
  },
});

const { theme } = useTheme();
const gridTheme = computed(() =>
  themeQuartz.withPart(theme.value === "dark" ? colorSchemeDark : colorSchemeLight),
);

const {
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
} = usePartsSearch();

const {
  currentPage,
  getBoundedPage,
  hasNextPage,
  hasPreviousPage,
  lastPage,
  pageInput,
  pageSize,
  pageSizeOptions,
  setPageSize,
  totalItems: totalParts,
  updateMetadata,
} = usePagination({
  pageSizeOptions: [5, 10, 25, 50, 100],
  defaultPageSize: 25,
  storageKey: "izzi-parts-page-size",
});

const advancedSearch = useTemplateRef<AdvancedPartSearchInstance>("advancedSearch");
const selectedPartCount = ref(0);
const selectedParts = ref<Part[]>([]);
const lastClickedPart = ref<Part | null>(null);

const isGridReady = ref(false);
const isExporting = ref(false);
const isDeleting = ref(false);

const deleteItems = ref<{ id: number; label: string }[]>([]);

const rowSelection = { mode: "multiRow", enableClickSelection: false } as const;
const { actionMessage, copyDetails, copyDetailsForParts, copyPartNumbers } = usePartsCopy();
const columnDefs = createPartsColumnDefs(
  copyDetailsForParts,
  (part) => copyPartNumbers([part]),
  requestDelete,
  () => searchQuery.value.trim(),
);

function requestDelete(part: Part) {
  deleteItems.value = [{ id: part.id, label: part.part_number }];
}

function requestBulkDelete() {
  deleteItems.value = selectedParts.value.map((part) => ({ id: part.id, label: part.part_number }));
}

async function confirmDelete(): Promise<void> {
  isDeleting.value = true;

  try {
    await Promise.all(deleteItems.value.map(({ id }) => deletePart(id)));
    deleteItems.value = [];
    await loadParts();
  } catch (error) {
    notifyApiError(error, "Unable to delete parts");
  } finally {
    isDeleting.value = false;
  }
}

const { errorMessage, isLoading, loadParts, parts } = usePartsData({
  page: currentPage,
  pageSize,
  searchQuery,
  conditions,
  sort,
  updatePagination: updateMetadata,
  onLoaded: () => {
    selectedPartCount.value = 0;
    selectedParts.value = [];
    actionMessage.value = null;
  },
});

const {
  exportCsv,
  handleGridReady,
  pinnedColumns,
  persistColumnState,
  resetColumnSettings,
  toggleColumn: setColumnVisibility,
  changePinnedColumn: setPinnedColumn,
  compactColumnWidths,
  visibleColumns,
} = usePartsGrid(() => {
  isGridReady.value = true;
});

function toggleColumn(field: string, visible: boolean) {
  visibleColumns.value[field] = visible;
  setColumnVisibility(field);
}

function changePinnedColumn(field: string, pinned: "" | "left" | "right") {
  pinnedColumns.value[field] = pinned;
  setPinnedColumn(field);
}

function copySelectedDetails(type: "quote" | "full") {
  return copyDetails(selectedParts.value, type);
}

function handleCellClicked(event: CellClickedEvent<Part>): void {
  lastClickedPart.value = event.data ?? null;

  if (event.colDef.field !== "part_number" || !event.data) return;

  void router.replace({ query: { ...route.query, part: String(event.data.id) } });
}

async function handleGridKeydown(event: KeyboardEvent): Promise<void> {
  if (!event.ctrlKey || event.isComposing || event.key.toLowerCase() !== "c") return;

  const target = event.target;

  if (
    target instanceof HTMLInputElement &&
    target.type !== "checkbox" &&
    target.type !== "radio"
  ) {
    return;
  }

  let partsToCopy = selectedParts.value;

  if (!partsToCopy.length && lastClickedPart.value) {
    partsToCopy = [lastClickedPart.value];
  }

  if (!partsToCopy.length) return;

  event.preventDefault();
  await copyDetails(partsToCopy, event.shiftKey ? "full" : "quote");
}

function createPartsFilename(): string {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "_")
    .replace("T", "-")
    .replace(/\.\d{3}Z$/, "");

  return `parts_${timestamp}.csv`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function exportSelectedParts() {
  exportCsv(true);
  actionMessage.value = "Selected parts exported";
}

async function exportAllParts() {
  isExporting.value = true;
  actionMessage.value = null;

  try {
    const blob = await exportParts({
      query: searchQuery.value.trim(),
      conditions: conditions.value,
      sort: sort.value,
    });

    downloadBlob(blob, createPartsFilename());

    actionMessage.value = "All parts exported";
  } catch (error: unknown) {
    notifyApiError(error, "Unable to export parts", { skipAuthenticationErrors: true });
  } finally {
    isExporting.value = false;
  }
}

watch(
  partsUrlQuery.state,
  async (state) => {
    if (isWritingUrl.value) return;

    updateFromUrl(state);
    await loadParts();
  },
  { flush: "sync" },
);

async function handleAdvancedSearchToggle(event: Event) {
  const details = event.currentTarget;

  if (!(details instanceof HTMLDetailsElement)) return;

  isAdvancedSearchOpen.value = details.open;

  if (details.open) {
    isAdvancedSearchLoaded.value = true;
    await nextTick();
    advancedSearch.value?.focusLastUnfilledField();
  }
}

async function searchParts() {
  conditions.value = [];
  await syncQueryToUrl();
  await loadParts();
}

async function applyAdvancedConditions(nextConditions: PartsCondition[]) {
  searchQuery.value = "";
  conditions.value = nextConditions;

  await syncQueryToUrl();
  await loadParts();
}

async function handleSortChanged(event: SortChangedEvent<Part>) {
  sort.value = event.api
    .getColumnState()
    .filter((column): column is typeof column & { sort: "asc" | "desc" } => column.sort !== null)
    .sort((left, right) => (left.sortIndex ?? 0) - (right.sortIndex ?? 0))
    .flatMap((column) =>
      isPartsSortField(column.colId) ? [{ field: column.colId, direction: column.sort }] : [],
    );

  await syncQueryToUrl();
  await loadParts();
}

async function goToPage(page: number) {
  await loadParts(getBoundedPage(page));
}

async function changePageSize(size: number) {
  setPageSize(size);
  await goToPage(1);
}

function handleSelectionChanged(event: SelectionChangedEvent<Part>) {
  selectedParts.value = event.api.getSelectedRows();
  selectedPartCount.value = selectedParts.value.length;
  actionMessage.value = null;
}

onMounted(async () => {
  await loadParts();
});
</script>
