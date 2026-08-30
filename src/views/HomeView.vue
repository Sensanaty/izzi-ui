<template>
  <h1 class="font-bold text-3xl mb-2">Parts</h1>

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

    <span v-if="actionMessage" class="text-text-muted text-sm" role="status">
      {{ actionMessage }}
    </span>
  </div>

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
    @sort-changed="persistColumnState"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  AllCommunityModule,
  colorSchemeDark,
  colorSchemeLight,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import { getParts } from "@/api/parts";
import PartsColumnSettings from "@/components/parts/PartsColumnSettings.vue";
import PartsGrid from "@/components/parts/PartsGrid.vue";
import IzziButton from "@/components/ui/IzziButton.vue";
import IzziInput from "@/components/ui/IzziInput.vue";
import { usePartsCopy } from "@/composables/usePartsCopy";
import { usePartsGrid } from "@/composables/usePartsGrid";
import { useTheme } from "@/composables/useTheme";
import { ApiError } from "@/lib/api";
import {
  columnOptions,
  createPartsColumnDefs,
  defaultColDef,
  selectionColumnDef,
} from "@/lib/partsGrid";

import type { Part } from "@/lib/schemas/part";
import type { SelectionChangedEvent } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

const pageSizeOptions = [5, 10, 25, 50, 100];
const pageSizeStorageKey = "izzi-parts-page-size";
const pageSize = ref(getInitialPageSize());
const pageInput = ref(1);
const parts = ref<Part[]>([]);
const searchQuery = ref("");
const currentPage = ref(1);
const lastPage = ref(1);
const totalParts = ref(0);
const selectedPartCount = ref(0);
const selectedParts = ref<Part[]>([]);
const isGridReady = ref(false);
const hasPreviousPage = computed(() => currentPage.value > 1);
const hasNextPage = computed(() => currentPage.value < lastPage.value);
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

const modules = [AllCommunityModule];
const { theme: appTheme } = useTheme();
const theme = computed(() =>
  themeQuartz.withPart(appTheme.value === "dark" ? colorSchemeDark : colorSchemeLight),
);
const rowSelection = { mode: "multiRow", enableClickSelection: false } as const;
const { actionMessage, copyDetails, copyDetailsForParts } = usePartsCopy();
const columnDefs = createPartsColumnDefs(copyDetailsForParts);

function getInitialPageSize(): number {
  const storedPageSize = Number(localStorage.getItem(pageSizeStorageKey));

  return pageSizeOptions.includes(storedPageSize) ? storedPageSize : 25;
}

const {
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

async function loadParts(page = 1): Promise<void> {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    const response = await getParts({
      page,
      count: pageSize.value,
      query: searchQuery.value.trim(),
    });
    parts.value = response.data;
    currentPage.value = response.metadata.page;
    pageInput.value = response.metadata.page;
    lastPage.value = response.metadata.last;
    totalParts.value = response.metadata.total;
    selectedPartCount.value = 0;
    selectedParts.value = [];
    actionMessage.value = null;
  } catch (error) {
    parts.value = [];
    errorMessage.value = error instanceof ApiError ? error.message : "Unable to load parts.";
  } finally {
    isLoading.value = false;
  }
}

function searchParts(): void {
  void loadParts();
}

function goToPage(page: number): void {
  const boundedPage = Math.min(Math.max(Math.trunc(page), 1), lastPage.value);
  void loadParts(boundedPage);
}

function changePageSize(size: number): void {
  pageSize.value = size;
  localStorage.setItem(pageSizeStorageKey, String(size));
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
