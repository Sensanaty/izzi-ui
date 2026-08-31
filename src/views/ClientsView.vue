<template>
  <h1 class="mb-2 font-bold text-3xl">Contacts</h1>

  <div class="flex flex-col gap-2 sm:flex-row sm:items-start">
    <form class="flex flex-col gap-2 sm:flex-row" @submit.prevent="searchContacts">
      <div class="w-full sm:max-w-sm">
        <IzziInput
          id="client-search"
          v-model="searchQuery"
          aria-label="Search contacts"
          placeholder="Search contacts"
          type="search"
          clearable
          @clear="searchContacts"
        />
      </div>

      <IzziButton type="submit" class="my-auto" :disabled="isLoading">Search</IzziButton>
    </form>

    <PartsColumnSettings
      :column-options="clientColumnOptions"
      :pinned-columns="pinnedColumns"
      :visible-columns="visibleColumns"
      @change-pinned-column="changePinnedColumn"
      @reset-settings="resetColumnSettings"
      @toggle-column="toggleColumn"
    />
  </div>

  <p v-if="errorMessage" class="text-danger" role="alert">{{ errorMessage }}</p>

  <div class="flex flex-wrap items-center gap-2" aria-label="Contact actions">
    <IzziButton
      size="sm"
      variant="danger"
      :disabled="!selectedClients.length || isLoading || isDeleting"
      @click="requestBulkDelete"
      >Delete selected</IzziButton
    >
  </div>

  <DeleteConfirmationModal
    v-if="deleteItems.length"
    item-label="contacts"
    :items="deleteItems"
    :deleting="isDeleting"
    @cancel="deleteItems = []"
    @confirm="confirmDelete"
  />

  <ClientsGrid
    :column-defs="columnDefs"
    :default-col-def="clientDefaultColDef"
    :is-grid-ready="isGridReady"
    :loading="isLoading"
    :modules="modules"
    :clients="clients"
    :row-selection="rowSelection"
    :selection-column-def="clientSelectionColumnDef"
    :theme="theme"
    :current-page="currentPage"
    :last-page="lastPage"
    :page-input="pageInput"
    :page-size="pageSize"
    :page-size-options="pageSizeOptions"
    :selected-client-count="selectedClientCount"
    :total-clients="totalClients"
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
import { computed, onMounted, ref, watch } from "vue";
import {
  AllCommunityModule,
  colorSchemeDark,
  colorSchemeLight,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import { deleteClient, isClientsSortField } from "@/api/clients";
import ClientsGrid from "@/components/clients/ClientsGrid.vue";
import PartsColumnSettings from "@/components/parts/PartsColumnSettings.vue";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal.vue";
import IzziInput from "@/components/ui/IzziInput.vue";
import { useClientsData } from "@/composables/useClientsData";
import { useClientSearch } from "@/composables/useClientSearch";
import { useGridColumnSettings } from "@/composables/useGridColumnSettings";
import { usePagination } from "@/composables/usePagination";
import { useTheme } from "@/composables/useTheme";
import {
  clientColumnOptions,
  clientDefaultColDef,
  clientSelectionColumnDef,
  createClientColumnDefs,
} from "@/lib/clientsGrid";
import { notifyApiError } from "@/lib/notifications";

import type { Client } from "@/lib/schemas/client";
import type { SelectionChangedEvent, SortChangedEvent } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);
const modules = [AllCommunityModule];

const selectedClients = ref<Client[]>([]);
const selectedClientCount = ref(0);
const isDeleting = ref(false);
const deleteItems = ref<{ id: number; label: string }[]>([]);

const skipDeleteConfirmation = ref(
  localStorage.getItem("izzi-skip-delete-confirmation") === "true",
);

const { clientUrlQuery, isWritingUrl, searchQuery, sort, syncQueryToUrl, updateFromUrl } =
  useClientSearch();

const pagination = usePagination({
  pageSizeOptions: [5, 10, 25, 50, 100],
  defaultPageSize: 25,
  storageKey: "izzi-clients-page-size",
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
  totalItems: totalClients,
  updateMetadata,
} = pagination;

const isGridReady = ref(false);
const { theme: appTheme } = useTheme();

const theme = computed(() =>
  themeQuartz.withPart(appTheme.value === "dark" ? colorSchemeDark : colorSchemeLight),
);

const rowSelection = { mode: "multiRow", enableClickSelection: false } as const;
const columnDefs = createClientColumnDefs(requestDelete);

const {
  handleGridReady,
  pinnedColumns,
  persistColumnState,
  resetColumnSettings,
  toggleColumn: setColumnVisibility,
  changePinnedColumn: setPinnedColumn,
  visibleColumns,
} = useGridColumnSettings<Client>({
  columnOptions: clientColumnOptions,
  storageKey: "izzi-clients-grid-column-state-v1",
  onReady: () => {
    isGridReady.value = true;
  },
});

function toggleColumn(field: string, visible: boolean): void {
  visibleColumns.value[field] = visible;
  setColumnVisibility(field);
}

function changePinnedColumn(field: string, pinned: "" | "left" | "right"): void {
  pinnedColumns.value[field] = pinned;
  setPinnedColumn(field);
}

function requestDelete(client: Client): void {
  deleteItems.value = [{ id: client.id, label: client.name }];

  if (skipDeleteConfirmation.value) void confirmDelete(false);
}

function requestBulkDelete(): void {
  deleteItems.value = selectedClients.value.map((client) => ({
    id: client.id,
    label: client.name,
  }));
}

async function confirmDelete(dontAskAgain: boolean): Promise<void> {
  if (dontAskAgain) {
    skipDeleteConfirmation.value = true;
    localStorage.setItem("izzi-skip-delete-confirmation", "true");
  }

  isDeleting.value = true;

  try {
    await Promise.all(deleteItems.value.map(({ id }) => deleteClient(id)));
    deleteItems.value = [];

    await loadClients();
  } catch (error) {
    notifyApiError(error, "Unable to delete contacts");
  } finally {
    isDeleting.value = false;
  }
}

const { clients, errorMessage, isLoading, loadClients } = useClientsData({
  page: currentPage,
  pageSize,
  searchQuery,
  sort,
  updatePagination: updateMetadata,
  onLoaded: () => {
    selectedClients.value = [];
    selectedClientCount.value = 0;
  },
});

function searchContacts(): void {
  void syncQueryToUrl().then(() => loadClients());
}

function goToPage(page: number): void {
  void loadClients(getBoundedPage(page));
}

function changePageSize(size: number): void {
  setPageSize(size);
  goToPage(1);
}

function handleSortChanged(event: SortChangedEvent<Client>): void {
  sort.value = event.api
    .getColumnState()
    .filter((column): column is typeof column & { sort: "asc" | "desc" } => column.sort !== null)
    .sort((left, right) => (left.sortIndex ?? 0) - (right.sortIndex ?? 0))
    .flatMap((column) =>
      isClientsSortField(column.colId) ? [{ field: column.colId, direction: column.sort }] : [],
    );
  void syncQueryToUrl().then(() => loadClients());
}

function handleSelectionChanged(event: SelectionChangedEvent<Client>): void {
  selectedClients.value = event.api.getSelectedRows();
  selectedClientCount.value = selectedClients.value.length;
}

watch(
  clientUrlQuery.state,
  (state) => {
    if (isWritingUrl.value) return;

    updateFromUrl(state);
    void loadClients();
  },
  { flush: "sync" },
);
onMounted(() => void loadClients());
</script>
