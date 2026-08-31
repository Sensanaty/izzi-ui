<template>
  <h1 class="mb-2 font-bold text-3xl">Parts</h1>

  <div class="flex flex-col gap-2 sm:flex-row sm:items-start">
    <form class="flex flex-col gap-2 sm:flex-row" @submit.prevent="searchParts">
      <div class="w-full sm:max-w-sm">
        <IzziInput
          id="part-search"
          v-model="searchQuery"
          aria-label="Search part number"
          placeholder="Search part number"
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
        :key="advancedSearchKey"
        :initial-conditions="conditions"
        @apply="applyAdvancedConditions"
      />
    </details>

    <PartsColumnSettings
      :column-options="columnOptions"
      :pinned-columns="pinnedColumns"
      :visible-columns="visibleColumns"
      @change-pinned-column="changePinnedColumn"
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
    item-label="parts"
    :items="deleteItems"
    :deleting="isDeleting"
    @cancel="deleteItems = []"
    @confirm="confirmDelete"
  />

  <PartsGrid
    :column-defs="columnDefs"
    :default-col-def="defaultColDef"
    :is-grid-ready="isGridReady"
    :loading="isLoading"
    :modules="modules"
    :parts="parts"
    :row-selection="rowSelection"
    :selection-column-def="selectionColumnDef"
    :theme="theme"
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
    @grid-ready="handleGridReady"
    @selection-changed="handleSelectionChanged"
    @sort-changed="handleSortChanged"
  />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref, watch } from "vue";
import {
  AllCommunityModule,
  colorSchemeDark,
  colorSchemeLight,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import { deletePart, exportParts, isPartsSortField } from "@/api/parts";
import PartsColumnSettings from "@/components/parts/PartsColumnSettings.vue";
import PartsGrid from "@/components/parts/PartsGrid.vue";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal.vue";
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
import type { SelectionChangedEvent, SortChangedEvent } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

const AdvancedPartSearch = defineAsyncComponent(
  () => import("@/components/parts/AdvancedPartSearch.vue"),
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

const pagination = usePagination({
  pageSizeOptions: [5, 10, 25, 50, 100],
  defaultPageSize: 25,
  storageKey: "izzi-parts-page-size",
});

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
} = pagination;

const selectedPartCount = ref(0);
const selectedParts = ref<Part[]>([]);
const isGridReady = ref(false);
const isExporting = ref(false);
const isDeleting = ref(false);
const deleteItems = ref<{ id: number; label: string }[]>([]);
const skipDeleteConfirmation = ref(localStorage.getItem("izzi-skip-delete-confirmation") === "true");

const modules = [AllCommunityModule];
const { theme: appTheme } = useTheme();
const theme = computed(() =>
  themeQuartz.withPart(appTheme.value === "dark" ? colorSchemeDark : colorSchemeLight),
);
const rowSelection = { mode: "multiRow", enableClickSelection: false } as const;
const { actionMessage, copyDetails, copyDetailsForParts } = usePartsCopy();
const columnDefs = createPartsColumnDefs(copyDetailsForParts, requestDelete);

function requestDelete(part: Part): void {
  deleteItems.value = [{ id: part.id, label: part.part_number }];

  if (skipDeleteConfirmation.value) void confirmDelete(false);
}

function requestBulkDelete(): void {
  deleteItems.value = selectedParts.value.map((part) => ({ id: part.id, label: part.part_number }));
}

async function confirmDelete(dontAskAgain: boolean): Promise<void> {
  if (dontAskAgain) {
    skipDeleteConfirmation.value = true;
    localStorage.setItem("izzi-skip-delete-confirmation", "true");
  }

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
  visibleColumns,
} = usePartsGrid(() => {
  isGridReady.value = true;
});

function toggleColumn(field: string, visible: boolean): void {
  visibleColumns.value[field] = visible;
  setColumnVisibility(field);
}

function changePinnedColumn(field: string, pinned: "" | "left" | "right"): void {
  pinnedColumns.value[field] = pinned;
  setPinnedColumn(field);
}

function copySelectedDetails(type: "quote" | "full"): Promise<void> {
  return copyDetails(selectedParts.value, type);
}

function createPartsFilename(): string {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "_")
    .replace("T", "-")
    .replace(/\.\d{3}Z$/, "");

  return `parts_${timestamp}.csv`;
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function exportSelectedParts(): void {
  exportCsv(true);
  actionMessage.value = "Selected parts exported";
}

async function exportAllParts(): Promise<void> {
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
  (state) => {
    if (isWritingUrl.value) return;

    updateFromUrl(state);

    void loadParts();
  },
  { flush: "sync" },
);

function handleAdvancedSearchToggle(event: Event): void {
  const details = event.currentTarget;

  if (!(details instanceof HTMLDetailsElement)) return;

  isAdvancedSearchOpen.value = details.open;

  if (details.open) isAdvancedSearchLoaded.value = true;
}

function searchParts(): void {
  conditions.value = [];
  void syncQueryToUrl().then(() => loadParts());
}

function applyAdvancedConditions(nextConditions: PartsCondition[]): void {
  searchQuery.value = "";
  conditions.value = nextConditions;

  void syncQueryToUrl().then(() => loadParts());
}

function handleSortChanged(event: SortChangedEvent<Part>): void {
  sort.value = event.api
    .getColumnState()
    .filter((column): column is typeof column & { sort: "asc" | "desc" } => column.sort !== null)
    .sort((left, right) => (left.sortIndex ?? 0) - (right.sortIndex ?? 0))
    .flatMap((column) =>
      isPartsSortField(column.colId) ? [{ field: column.colId, direction: column.sort }] : [],
    );

  void syncQueryToUrl().then(() => loadParts());
}

function goToPage(page: number): void {
  void loadParts(getBoundedPage(page));
}

function changePageSize(size: number): void {
  setPageSize(size);
  goToPage(1);
}

function handleSelectionChanged(event: SelectionChangedEvent<Part>): void {
  selectedParts.value = event.api.getSelectedRows();
  selectedPartCount.value = selectedParts.value.length;
  actionMessage.value = null;
}

onMounted(async () => {
  await loadParts();
});
</script>
