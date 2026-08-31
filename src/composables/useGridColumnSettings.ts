import { nextTick, ref } from "vue";
import { z } from "zod";

import type { ColumnPinnedType, ColumnState, GridApi, GridReadyEvent } from "ag-grid-community";

export type PinnedColumn = "" | "left" | "right";
type GridReadyCallback = () => void;
type ColumnOption = { field: string };

const selectionColumnId = "ag-Grid-SelectionColumn";
const columnStateSchema = z.array(
  z.object({
    colId: z.string(),
    hide: z.boolean().nullable().optional(),
    width: z.number().nullable().optional(),
    flex: z.number().nullable().optional(),
    sort: z.enum(["asc", "desc"]).nullable().optional(),
    sortIndex: z.number().nullable().optional(),
    pinned: z.union([z.literal("left"), z.literal("right"), z.boolean()]).nullable().optional(),
  }),
);

export function useGridColumnSettings<TRow extends object>(
  options: {
    columnOptions: readonly ColumnOption[];
    storageKey: string;
    onReady: GridReadyCallback;
    autoSizeColumns?: string[];
  },
) {
  const gridApi = ref<GridApi<TRow> | null>(null);
  const visibleColumns = ref<Record<string, boolean>>(
    Object.fromEntries(options.columnOptions.map(({ field }) => [field, true])),
  );
  const pinnedColumns = ref<Record<string, PinnedColumn>>(
    Object.fromEntries(options.columnOptions.map(({ field }) => [field, ""])),
  );

  function getPersistedColumnState(): ColumnState[] | null {
    const storedState = localStorage.getItem(options.storageKey);

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

    localStorage.setItem(options.storageKey, JSON.stringify(gridApi.value.getColumnState()));
    syncColumnControls(gridApi.value.getColumnState());
  }

  function handleGridReady(event: GridReadyEvent<TRow>): void {
    gridApi.value = event.api;
    const persistedState = getPersistedColumnState();

    if (persistedState) event.api.applyColumnState({ state: persistedState, applyOrder: true });

    event.api.setColumnsPinned([selectionColumnId], "left");
    syncColumnControls(event.api.getColumnState());

    void nextTick(() => {
      if (!persistedState && options.autoSizeColumns?.length) {
        event.api.autoSizeColumns(options.autoSizeColumns);
      }

      options.onReady();
    });
  }

  function toggleColumn(field: string): void {
    gridApi.value?.setColumnsVisible([field], visibleColumns.value[field] ?? true);
  }

  function changePinnedColumn(field: string): void {
    const pinnedValue: ColumnPinnedType | null = pinnedColumns.value[field] || null;
    gridApi.value?.setColumnsPinned([field], pinnedValue);
  }

  function resetColumnSettings(): void {
    gridApi.value?.resetColumnState();
    gridApi.value?.setColumnsPinned([selectionColumnId], "left");

    if (options.autoSizeColumns?.length) gridApi.value?.autoSizeColumns(options.autoSizeColumns);

    localStorage.removeItem(options.storageKey);

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
