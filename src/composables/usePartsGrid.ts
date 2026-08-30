import { nextTick, ref } from "vue";
import { z } from "zod";
import { columnOptions } from "@/lib/partsGrid";

import type { Part } from "@/lib/schemas/part";
import type { ColumnPinnedType, ColumnState, GridApi, GridReadyEvent } from "ag-grid-community";

const columnStateStorageKey = "izzi-parts-grid-column-state-v4";
const selectionColumnId = "ag-Grid-SelectionColumn";

const columnStateSchema = z.array(
  z.object({
    colId: z.string(),
    hide: z.boolean().nullable().optional(),
    width: z.number().nullable().optional(),
    flex: z.number().nullable().optional(),
    sort: z.enum(["asc", "desc"]).nullable().optional(),
    sortIndex: z.number().nullable().optional(),
    pinned: z
      .union([z.literal("left"), z.literal("right"), z.boolean()])
      .nullable()
      .optional(),
  }),
);

type PinnedColumn = "" | "left" | "right";
type GridReadyCallback = () => void;

export function usePartsGrid(onReady: GridReadyCallback) {
  const gridApi = ref<GridApi<Part> | null>(null);
  const visibleColumns = ref<Record<string, boolean>>(
    Object.fromEntries(columnOptions.map(({ field }) => [field, true])),
  );
  const pinnedColumns = ref<Record<string, PinnedColumn>>(
    Object.fromEntries(columnOptions.map(({ field }) => [field, ""])),
  );

  function getPersistedColumnState(): ColumnState[] | null {
    const storedState = localStorage.getItem(columnStateStorageKey);

    if (!storedState) return null;

    try {
      const result = columnStateSchema.safeParse(JSON.parse(storedState));

      return result.success ? result.data : null;
    } catch {
      return null;
    }
  }

  function syncColumnControls(columnState: ColumnState[]): void {
    columnState.forEach((state) => {
      visibleColumns.value[state.colId] = state.hide !== true;
      pinnedColumns.value[state.colId] =
        state.pinned === "left" || state.pinned === "right" ? state.pinned : "";
    });
  }

  function persistColumnState(): void {
    if (!gridApi.value) return;

    const columnState = gridApi.value.getColumnState();
    localStorage.setItem(columnStateStorageKey, JSON.stringify(columnState));
    syncColumnControls(columnState);
  }

  function handleGridReady(event: GridReadyEvent<Part>): void {
    gridApi.value = event.api;
    const persistedState = getPersistedColumnState();

    if (persistedState) event.api.applyColumnState({ state: persistedState, applyOrder: true });

    event.api.setColumnsPinned([selectionColumnId], "left");
    syncColumnControls(event.api.getColumnState());

    void nextTick(() => {
      if (!persistedState) event.api.autoSizeColumns(["tag"]);

      onReady();
    });
  }

  function toggleColumn(field: string): void {
    gridApi.value?.setColumnsVisible([field], visibleColumns.value[field] ?? true);
  }

  function changePinnedColumn(field: string): void {
    const pinnedValue: ColumnPinnedType = pinnedColumns.value[field] || null;
    gridApi.value?.setColumnsPinned([field], pinnedValue);
  }

  function resetColumnSettings(): void {
    gridApi.value?.resetColumnState();
    gridApi.value?.setColumnsPinned([selectionColumnId], "left");
    gridApi.value?.autoSizeColumns(["tag"]);

    localStorage.removeItem(columnStateStorageKey);

    if (gridApi.value) syncColumnControls(gridApi.value.getColumnState());
  }

  return {
    changePinnedColumn,
    handleGridReady,
    pinnedColumns,
    persistColumnState,
    resetColumnSettings,
    toggleColumn,
    visibleColumns,
  };
}
