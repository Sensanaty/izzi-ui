<template>
  <section aria-label="Contacts">
    <PartsPagination
      v-bind="paginationProps"
      id-prefix="clients-top"
      item-label="contacts"
      @change-page-size="emit('change-page-size', $event)"
      @go-to-page="emit('go-to-page', $event)"
      @update:page-input="emit('update:page-input', $event)"
    />

    <AgGridTable
      :column-defs="columnDefs"
      :default-col-def="defaultColDef"
      :is-grid-ready="isGridReady"
      :loading="loading"
      :modules="modules"
      :row-data="clients"
      :row-selection="rowSelection"
      :selection-column-def="selectionColumnDef"
      :theme="theme"
      @column-moved="emit('column-moved')"
      @column-pinned="emit('column-pinned')"
      @column-resized="emit('column-resized')"
      @column-visible="emit('column-visible')"
      @grid-ready="emit('grid-ready', $event)"
      @row-clicked="emit('row-clicked', $event)"
      @selection-changed="emit('selection-changed', $event)"
      @sort-changed="emit('sort-changed', $event)"
    />

    <PartsPagination
      v-bind="paginationProps"
      id-prefix="clients-bottom"
      item-label="contacts"
      @change-page-size="emit('change-page-size', $event)"
      @go-to-page="emit('go-to-page', $event)"
      @update:page-input="emit('update:page-input', $event)"
    />
  </section>
</template>

<script setup lang="ts">
import PartsPagination from "@/components/parts/PartsPagination.vue";
import AgGridTable from "@/components/ui/AgGridTable.vue";

import type { Client } from "@/lib/schemas/client";
import type {
  ColDef,
  GridReadyEvent,
  Module,
  RowClickedEvent,
  RowSelectionOptions,
  SelectionChangedEvent,
  SelectionColumnDef,
  SortChangedEvent,
  Theme,
} from "ag-grid-community";

const props = defineProps<{
  columnDefs: ColDef<Client>[];
  defaultColDef: ColDef<Client>;
  isGridReady: boolean;
  loading: boolean;
  modules: Module[];
  clients: Client[];
  rowSelection: RowSelectionOptions<Client>;
  selectionColumnDef: SelectionColumnDef;
  theme: Theme;
  currentPage: number;
  lastPage: number;
  pageInput: number;
  pageSize: number;
  pageSizeOptions: number[];
  selectedClientCount: number;
  totalClients: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}>();

const paginationProps = {
  get currentPage() {
    return props.currentPage;
  },
  get lastPage() {
    return props.lastPage;
  },
  get pageInput() {
    return props.pageInput;
  },
  get pageSize() {
    return props.pageSize;
  },
  get pageSizeOptions() {
    return props.pageSizeOptions;
  },
  get selectedCount() {
    return props.selectedClientCount;
  },
  get totalItems() {
    return props.totalClients;
  },
  get hasPreviousPage() {
    return props.hasPreviousPage;
  },
  get hasNextPage() {
    return props.hasNextPage;
  },
  get disabled() {
    return props.loading;
  },
};

const emit = defineEmits<{
  "column-moved": [];
  "column-pinned": [];
  "column-resized": [];
  "column-visible": [];
  "grid-ready": [event: GridReadyEvent<Client>];
  "row-clicked": [event: RowClickedEvent<Client>];
  "selection-changed": [event: SelectionChangedEvent<Client>];
  "sort-changed": [event: SortChangedEvent<Client>];
  "go-to-page": [page: number];
  "change-page-size": [size: number];
  "update:page-input": [page: number];
}>();
</script>
