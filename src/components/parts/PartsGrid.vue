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
      :selected-part-count="selectedPartCount"
      :total-parts="totalParts"
      @change-page-size="emit('change-page-size', $event)"
      @go-to-page="emit('go-to-page', $event)"
      @update:page-input="emit('update:page-input', $event)"
    />

    <div class="relative border-b py-3.5">
      <AgGridVue
        class="w-full"
        :column-defs="columnDefs"
        :selection-column-def="selectionColumnDef"
        :animate-rows="false"
        dom-layout="autoHeight"
        :default-col-def="defaultColDef"
        :enable-cell-text-selection="true"
        :ensure-dom-order="true"
        :loading="loading || !isGridReady"
        :modules="modules"
        :row-data="parts"
        :row-selection="rowSelection"
        :suppress-column-move-animation="true"
        :theme="theme"
        @column-moved="emit('column-moved')"
        @column-pinned="emit('column-pinned')"
        @column-resized="emit('column-resized')"
        @column-visible="emit('column-visible')"
        @grid-ready="emit('grid-ready', $event)"
        @selection-changed="emit('selection-changed', $event)"
        @sort-changed="emit('sort-changed')"
      />
    </div>

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
      :selected-part-count="selectedPartCount"
      :total-parts="totalParts"
      @change-page-size="emit('change-page-size', $event)"
      @go-to-page="emit('go-to-page', $event)"
      @update:page-input="emit('update:page-input', $event)"
    />
  </section>
</template>

<script setup lang="ts">
import { AgGridVue } from "ag-grid-vue3";
import PartsPagination from "@/components/parts/PartsPagination.vue";

import type { Part } from "@/lib/schemas/part";
import type {
  ColDef,
  GridReadyEvent,
  Module,
  SelectionChangedEvent,
  SelectionColumnDef,
  RowSelectionOptions,
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
  "column-moved": [];
  "column-pinned": [];
  "column-resized": [];
  "column-visible": [];
  "grid-ready": [event: GridReadyEvent<Part>];
  "selection-changed": [event: SelectionChangedEvent<Part>];
  "sort-changed": [];
  "go-to-page": [page: number];
  "change-page-size": [size: number];
  "update:page-input": [page: number];
}>();
</script>

<style scoped>
@reference "#style.css";

:deep(.ag-layout-auto-height .ag-grid-scrolling-rows),
:deep(.ag-layout-auto-height .ag-center-cols-viewport),
:deep(.ag-layout-auto-height .ag-center-cols-clipper),
:deep(.ag-layout-auto-height .ag-center-cols-container) {
  min-height: 0 !important;
}

:deep(.ag-cell-wrapper) {
  align-items: center;
}

:deep(.ag-cell[col-id="tag"] .ag-cell-value) {
  @apply leading-tight;
}

:deep(.ag-cell[col-id="actions"]) {
  align-items: center;
}

:deep(.ag-cell[col-id="actions"] .ag-cell-wrapper) {
  height: 100%;
  min-height: 100%;
}

:deep(.ag-body-horizontal-scroll.ag-scrollbar-invisible) {
  @apply static;
}
</style>
