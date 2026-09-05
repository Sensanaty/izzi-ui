<template>
  <section aria-label="Parts inventory">
    <PartsPagination
      id-prefix="top"
      :current-page="currentPage"
      :disabled="loading"
      :has-next-page="hasNextPage"
      :has-previous-page="hasPreviousPage"
      :last-page="lastPage"
      :page-input="pageInput"
      :page-size="pageSize"
      :page-size-options="pageSizeOptions"
      :selected-count="selectedPartCount"
      :total-items="totalParts"
      item-label="parts"
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
      :row-data="parts"
      :row-selection="rowSelection"
      :selection-column-def="selectionColumnDef"
      :theme="theme"
      @column-moved="emit('column-moved')"
      @keydown="emit('keydown', $event)"
      @column-pinned="emit('column-pinned')"
      @column-resized="emit('column-resized')"
      @column-visible="emit('column-visible')"
      @grid-ready="emit('grid-ready', $event)"
      @row-clicked="emit('row-clicked', $event)"
      @selection-changed="emit('selection-changed', $event)"
      @sort-changed="emit('sort-changed', $event)"
    />

    <PartsPagination
      id-prefix="bottom"
      :current-page="currentPage"
      :disabled="loading"
      :has-next-page="hasNextPage"
      :has-previous-page="hasPreviousPage"
      :last-page="lastPage"
      :page-input="pageInput"
      :page-size="pageSize"
      :page-size-options="pageSizeOptions"
      :selected-count="selectedPartCount"
      :total-items="totalParts"
      item-label="parts"
      @change-page-size="emit('change-page-size', $event)"
      @go-to-page="emit('go-to-page', $event)"
      @update:page-input="emit('update:page-input', $event)"
    />
  </section>
</template>

<script setup lang="ts">
import PartsPagination from "@/components/parts/PartsPagination.vue";
import AgGridTable from "@/components/ui/AgGridTable.vue";

import type { Part } from "@/lib/schemas/part";
import type {
  ColDef,
  GridReadyEvent,
  Module,
  RowClickedEvent,
  SelectionChangedEvent,
  SelectionColumnDef,
  RowSelectionOptions,
  SortChangedEvent,
  Theme,
} from "ag-grid-community";

defineProps<{
  columnDefs: ColDef<Part>[];
  defaultColDef: ColDef<Part>;
  isGridReady: boolean;
  loading: boolean;
  modules: Module[];
  parts: Part[];
  rowSelection: RowSelectionOptions<Part>;
  selectionColumnDef: SelectionColumnDef;
  theme: Theme;
  currentPage: number;
  lastPage: number;
  pageInput: number;
  pageSize: number;
  pageSizeOptions: number[];
  selectedPartCount: number;
  totalParts: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}>();

const emit = defineEmits<{
  keydown: [event: KeyboardEvent];
  "column-moved": [];
  "column-pinned": [];
  "column-resized": [];
  "column-visible": [];
  "grid-ready": [event: GridReadyEvent<Part>];
  "row-clicked": [event: RowClickedEvent<Part>];
  "selection-changed": [event: SelectionChangedEvent<Part>];
  "sort-changed": [event: SortChangedEvent<Part>];
  "go-to-page": [page: number];
  "change-page-size": [size: number];
  "update:page-input": [page: number];
}>();
</script>
