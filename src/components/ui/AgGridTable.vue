<template>
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
      multi-sort-key="ctrl"
      :row-data="rowData"
      :row-selection="rowSelection"
      :suppress-column-move-animation="true"
      :theme="theme"
      @column-moved="emit('column-moved')"
      @column-pinned="emit('column-pinned')"
      @column-resized="emit('column-resized')"
      @column-visible="emit('column-visible')"
      @grid-ready="emit('grid-ready', $event)"
      @selection-changed="emit('selection-changed', $event)"
      @sort-changed="emit('sort-changed', $event)"
    />
  </div>
</template>

<script setup lang="ts" generic="TRow extends object">
import { AgGridVue } from "ag-grid-vue3";

import type {
  ColDef,
  GridReadyEvent,
  Module,
  SelectionChangedEvent,
  SelectionColumnDef,
  RowSelectionOptions,
  SortChangedEvent,
  Theme,
} from "ag-grid-community";

defineProps<{
  columnDefs: ColDef<TRow>[];
  defaultColDef: ColDef<TRow>;
  isGridReady: boolean;
  loading: boolean;
  modules: Module[];
  rowData: TRow[];
  rowSelection: RowSelectionOptions<TRow>;
  selectionColumnDef: SelectionColumnDef;
  theme: Theme;
}>();

const emit = defineEmits<{
  "column-moved": [];
  "column-pinned": [];
  "column-resized": [];
  "column-visible": [];
  "grid-ready": [event: GridReadyEvent<TRow>];
  "selection-changed": [event: SelectionChangedEvent<TRow>];
  "sort-changed": [event: SortChangedEvent<TRow>];
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
