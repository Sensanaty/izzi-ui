<template>
  <div class="flex items-center justify-between gap-3">
    <h1 class="mb-2 font-bold text-3xl">Companies</h1>
  </div>

  <div class="flex flex-col gap-2 sm:flex-row sm:items-start">
    <form class="flex flex-col gap-2 sm:flex-row" @submit.prevent="searchCompanies">
      <div class="w-full sm:max-w-sm">
        <IzziInput
          id="company-search"
          v-model="searchQuery"
          aria-label="Search companies"
          placeholder="Search companies"
          type="search"
          clearable
          @clear="searchCompanies"
        />
      </div>

      <IzziButton type="submit" class="my-auto" :disabled="isLoading">Search</IzziButton>

      <IzziButton
        class="my-auto"
        :variant="needsCleanupOnly ? 'primary' : 'outline'"
        :disabled="isLoading"
        @click="handleDirtyRecordsClick"
      >
        Filter by dirty records
      </IzziButton>
    </form>

    <PartsColumnSettings
      :column-options="companyColumnOptions"
      :pinned-columns="pinnedColumns"
      :visible-columns="visibleColumns"
      @change-pinned-column="changePinnedColumn"
      @reset-settings="resetColumnSettings"
      @toggle-column="toggleColumn"
    />
  </div>

  <p v-if="errorMessage" class="text-danger" role="alert">{{ errorMessage }}</p>

  <div class="flex flex-wrap items-center gap-2" aria-label="Company actions">
    <IzziButton
      size="sm"
      variant="danger"
      :disabled="!selectedCompanies.length || isLoading || isDeleting"
      @click="requestBulkDelete"
    >
      Delete selected
    </IzziButton>
  </div>

  <DeleteConfirmationModal
    v-if="deleteItems.length"
    item-label="company"
    item-label-plural="companies"
    :items="deleteItems"
    :deleting="isDeleting"
    @cancel="deleteItems = []"
    @confirm="confirmDelete"
  />

  <DirtyRecordsModal
    v-if="isDirtyRecordsModalOpen"
    v-model="isDirtyRecordsModalOpen"
    :is-filtering="needsCleanupOnly"
  />

  <CompanyDetailsSidebar
    v-if="selectedCompanyId !== null"
    v-model="isCompanySidebarOpen"
    :company-id="selectedCompanyId"
  />

  <section aria-label="Companies">
    <PartsPagination
      id-prefix="companies-top"
      :current-page="currentPage"
      :disabled="isLoading"
      :has-next-page="hasNextPage"
      :has-previous-page="hasPreviousPage"
      :last-page="lastPage"
      :page-input="pageInput"
      :page-size="pageSize"
      :page-size-options="pageSizeOptions"
      :selected-count="selectedCompanyCount"
      :total-items="totalCompanies"
      item-label="companies"
      @change-page-size="changePageSize"
      @go-to-page="goToPage"
      @update:page-input="pageInput = $event"
    />

    <AgGridTable
      :column-defs="companyColumnDefs"
      :default-col-def="companyDefaultColDef"
      :is-grid-ready="isGridReady"
      :loading="isLoading"
      :modules="modules"
      :row-data="companies"
      :row-selection="rowSelection"
      :selection-column-def="companySelectionColumnDef"
      :theme="theme"
      @column-moved="persistColumnState"
      @column-pinned="persistColumnState"
      @column-resized="persistColumnState"
      @column-visible="persistColumnState"
      @cell-clicked="handleCellClicked"
      @grid-ready="handleGridReady"
      @selection-changed="handleSelectionChanged"
      @sort-changed="handleSortChanged"
    />

    <PartsPagination
      id-prefix="companies-bottom"
      :current-page="currentPage"
      :disabled="isLoading"
      :has-next-page="hasNextPage"
      :has-previous-page="hasPreviousPage"
      :last-page="lastPage"
      :page-input="pageInput"
      :page-size="pageSize"
      :page-size-options="pageSizeOptions"
      :selected-count="selectedCompanyCount"
      :total-items="totalCompanies"
      item-label="companies"
      @change-page-size="changePageSize"
      @go-to-page="goToPage"
      @update:page-input="pageInput = $event"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref, watch } from "vue";
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColumnApiModule,
  colorSchemeDark,
  colorSchemeLight,
  ModuleRegistry,
  RowSelectionModule,
  themeQuartz,
} from "ag-grid-community";
import { useRoute, useRouter } from "vue-router";
import { deleteCompany, getCompaniesPage, isCompaniesSortField } from "@/api/companies";
import PartsColumnSettings from "@/components/parts/PartsColumnSettings.vue";
import PartsPagination from "@/components/parts/PartsPagination.vue";
import AgGridTable from "@/components/ui/AgGridTable.vue";
import IzziButton from "@/components/ui/IzziButton.vue";
import IzziInput from "@/components/ui/IzziInput.vue";
import { useCompanySearch } from "@/composables/useCompanySearch";
import { useGridColumnSettings } from "@/composables/useGridColumnSettings";
import { usePagination } from "@/composables/usePagination";
import { useTheme } from "@/composables/useTheme";
import {
  createCompanyColumnDefs,
  companyColumnOptions,
  companyDefaultColDef,
  companySelectionColumnDef,
} from "@/lib/companiesGrid";
import { notifyApiError } from "@/lib/notifications";
import { useCompanyOptionsStore } from "@/stores/companyOptions";

import type { Company } from "@/lib/schemas/company";
import type { CellClickedEvent, SelectionChangedEvent, SortChangedEvent } from "ag-grid-community";

const DIRTY_RECORDS_HELP_STORAGE_KEY = "izzi-companies-dirty-records-help-seen-v1";

const CompanyDetailsSidebar = defineAsyncComponent(
  () => import("@/components/companies/CompanyDetailsSidebar.vue"),
);

const DeleteConfirmationModal = defineAsyncComponent(
  () => import("@/components/ui/DeleteConfirmationModal.vue"),
);

const DirtyRecordsModal = defineAsyncComponent(
  () => import("@/components/companies/DirtyRecordsModal.vue"),
);

const modules = [CellStyleModule, ClientSideRowModelModule, ColumnApiModule, RowSelectionModule];
ModuleRegistry.registerModules(modules);

const companyOptionsStore = useCompanyOptionsStore();
const route = useRoute();
const router = useRouter();
const selectedCompanyId = computed(() => {
  const value = route.query.company;
  const parsed = typeof value === "string" ? Number(value) : NaN;

  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
});
const isCompanySidebarOpen = computed({
  get: () => selectedCompanyId.value !== null,
  set: (isOpen: boolean) => {
    if (!isOpen) void router.replace({ query: { ...route.query, company: undefined } });
  },
});
const companies = ref<Company[]>([]);
const totalCompanies = ref(0);
const selectedCompanies = ref<Company[]>([]);
const needsCleanupOnly = ref(false);
const isDirtyRecordsModalOpen = ref(false);

const isDeleting = ref(false);
const deleteItems = ref<{ id: number; label: string }[]>([]);
const { companyUrlQuery, isWritingUrl, searchQuery, sort, syncQueryToUrl, updateFromUrl } =
  useCompanySearch();
const selectedCompanyCount = ref(0);

const errorMessage = ref<string | null>(null);
const isLoading = ref(true);
const isGridReady = ref(false);
const { theme: appTheme } = useTheme();
const theme = computed(() =>
  themeQuartz.withPart(appTheme.value === "dark" ? colorSchemeDark : colorSchemeLight),
);
const rowSelection = { mode: "multiRow", enableClickSelection: false } as const;
const companyColumnDefs = createCompanyColumnDefs(requestDelete);
const {
  handleGridReady,
  pinnedColumns,
  persistColumnState,
  resetColumnSettings,
  toggleColumn: setColumnVisibility,
  changePinnedColumn: setPinnedColumn,
  visibleColumns,
} = useGridColumnSettings<Company>({
  columnOptions: companyColumnOptions,
  storageKey: "izzi-companies-grid-column-state-v1",
  onReady: () => {
    isGridReady.value = true;
  },
});
const pagination = usePagination({
  pageSizeOptions: [5, 10, 25, 50, 100],
  defaultPageSize: 25,
  storageKey: "izzi-companies-page-size",
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
  updateMetadata,
} = pagination;

function requestDelete(company: Company) {
  deleteItems.value = [{ id: company.id, label: company.name }];
}

function requestBulkDelete(): void {
  deleteItems.value = selectedCompanies.value.map((company) => ({
    id: company.id,
    label: company.name,
  }));
}

async function confirmDelete(): Promise<void> {
  isDeleting.value = true;

  try {
    await Promise.all(deleteItems.value.map(({ id }) => deleteCompany(id)));
    deleteItems.value.forEach(({ id }) => companyOptionsStore.removeCompany(id));
    deleteItems.value = [];
    selectedCompanies.value = [];
    await loadCompanies();
  } catch (error) {
    notifyApiError(error, "Unable to delete companies");
  } finally {
    isDeleting.value = false;
  }
}

async function loadCompanies(page = currentPage.value) {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    const response = await getCompaniesPage({
      page,
      count: pageSize.value,
      query: searchQuery.value.trim(),
      needsCleanup: needsCleanupOnly.value,
      sort: sort.value,
    });
    companies.value = response.data;
    totalCompanies.value = response.metadata.total;
    updateMetadata(response.metadata);
    selectedCompanies.value = [];
    selectedCompanyCount.value = 0;
  } catch (error) {
    companies.value = [];
    errorMessage.value = notifyApiError(error, "Unable to load companies").message;
  } finally {
    isLoading.value = false;
  }
}

async function searchCompanies() {
  await syncQueryToUrl();
  await loadCompanies();
}

async function handleDirtyRecordsClick(): Promise<void> {
  needsCleanupOnly.value = !needsCleanupOnly.value;

  if (localStorage.getItem(DIRTY_RECORDS_HELP_STORAGE_KEY) !== "true") {
    isDirtyRecordsModalOpen.value = true;
    localStorage.setItem(DIRTY_RECORDS_HELP_STORAGE_KEY, "true");
  }

  await loadCompanies(1);
}

async function goToPage(page: number) {
  await loadCompanies(getBoundedPage(page));
}

async function changePageSize(size: number) {
  setPageSize(size);
  await goToPage(1);
}

async function handleSortChanged(event: SortChangedEvent<Company>) {
  sort.value = event.api
    .getColumnState()
    .filter((column): column is typeof column & { sort: "asc" | "desc" } => column.sort !== null)
    .sort((left, right) => (left.sortIndex ?? 0) - (right.sortIndex ?? 0))
    .flatMap((column) =>
      isCompaniesSortField(column.colId) ? [{ field: column.colId, direction: column.sort }] : [],
    );

  await syncQueryToUrl();
  await loadCompanies();
}

function toggleColumn(field: string, visible: boolean) {
  visibleColumns.value[field] = visible;
  setColumnVisibility(field);
}

function changePinnedColumn(field: string, pinned: "" | "left" | "right") {
  pinnedColumns.value[field] = pinned;
  setPinnedColumn(field);
}

function handleCellClicked(event: CellClickedEvent<Company>): void {
  if (
    !(event.event instanceof MouseEvent) ||
    !event.event.ctrlKey ||
    event.column?.getColId() === "actions" ||
    !event.data
  ) {
    return;
  }

  void router.replace({ query: { ...route.query, company: String(event.data.id) } });
}

function handleSelectionChanged(event: SelectionChangedEvent<Company>) {
  selectedCompanies.value = event.api.getSelectedRows();
  selectedCompanyCount.value = selectedCompanies.value.length;
}

watch(
  companyUrlQuery.state,
  async (state) => {
    if (isWritingUrl.value) return;

    updateFromUrl(state);
    await loadCompanies();
  },
  { flush: "sync" },
);

onMounted(async () => {
  await loadCompanies();
});
</script>
