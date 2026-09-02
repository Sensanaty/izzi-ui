<template>
  <details
    ref="detailsElement"
    class="relative w-full sm:ml-auto sm:w-2xl open:ring-2 open:ring-primary"
    @toggle="handleToggle"
  >
    <summary
      class="border-border bg-surface-raised text-text flex cursor-pointer list-none items-center justify-between gap-3 rounded-sm border-2 px-4 py-2 text-base font-bold marker:hidden"
    >
      <span class="flex items-center gap-2">
        <Settings class="size-4" aria-hidden="true" />
        <span>Table Settings</span>
      </span>
      <span class="text-text-muted text-sm font-medium"
        >{{ visibleCount }} of {{ columnOptions.length }} visible</span
      >
    </summary>

    <div
      class="border-border bg-surface-raised absolute right-0 z-10 mt-2 grid max-h-screen w-full min-w-0 overflow-y-auto rounded-sm border-2 p-4 shadow-lg"
    >
      <div class="grid gap-1">
        <h2 class="text-lg font-bold">Customize your table</h2>

        <p class="text-text-muted text-sm">
          Choose which columns appear and which stay visible while scrolling
        </p>
      </div>

      <div class="mt-4 grid gap-2">
        <IzziInput
          ref="columnSearchInput"
          id="column-settings-search"
          v-model="searchQuery"
          aria-label="Search columns"
          placeholder="Search columns"
          type="search"
          clearable
        >
          <template #prefix>
            <Search class="text-text-muted size-4" aria-hidden="true" />
          </template>
        </IzziInput>

        <div class="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span class="text-text-muted"
            >{{ visibleCount }} of {{ columnOptions.length }} columns visible</span
          >
          <div class="flex gap-2">
            <IzziButton size="xs" variant="ghost" @click="showAllColumns">Show all</IzziButton>

            <IzziButton size="xs" variant="ghost" @click="hideAllColumns">Hide all</IzziButton>
          </div>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-2 gap-4">
        <section v-for="group in visibleGroups" :key="group" class="grid min-w-0 gap-1">
          <h3 class="text-text text-sm font-bold uppercase tracking-wide">{{ group }}</h3>

          <div
            v-for="column in groupedColumns[group]"
            :key="column.field"
            class="hover:bg-surface-hover flex h-10 min-w-0 items-center justify-start gap-2 rounded-sm px-1"
          >
            <label
              class="text-text flex h-10 min-w-0 flex-1 cursor-pointer items-center gap-2 text-base"
            >
              <input
                :checked="visibleColumns[column.field]"
                class="accent-primary size-4"
                type="checkbox"
                @change="toggleColumn(column.field, $event)"
              />

              <span class="min-w-0">{{ column.label }}</span>
            </label>

            <select
              :value="pinnedColumns[column.field]"
              :aria-label="`Pin ${column.label}`"
              class="bg-input border-border focus:ring-focus-ring min-h-8 w-28 shrink-0 rounded-sm border px-2 py-1 text-sm outline-none focus:ring-2"
              @change="changePinnedColumn(column.field, $event)"
            >
              <option value="">Not pinned</option>

              <option value="left">Pin left</option>

              <option value="right">Pin right</option>
            </select>
          </div>
        </section>

        <p v-if="!visibleGroups.length" class="text-text-muted col-span-2 py-4 text-center text-sm">
          No columns match “{{ searchQuery }}”
        </p>
      </div>

      <div class="border-border mt-4 grid gap-2 border-t pt-3">
        <p class="text-text-muted text-sm">
          Pinned columns stay visible while scrolling horizontally. Drag table headers to reorder
          columns.
        </p>

        <IzziButton size="sm" variant="secondary" @click="emit('compact-widths')">
          Squish column widths
        </IzziButton>

        <IzziButton size="sm" variant="outline" @click="emit('reset-settings')">
          Reset to default settings
        </IzziButton>
      </div>
    </div>
  </details>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue";
import { Search, Settings } from "@lucide/vue";
import IzziButton from "@/components/ui/IzziButton.vue";
import IzziInput from "@/components/ui/IzziInput.vue";

import type { ColumnGroup } from "@/lib/partsGrid";

type SettingsColumn = {
  field: string;
  label: string;
  group?: ColumnGroup;
};

const props = defineProps<{
  columnOptions: readonly SettingsColumn[];
  visibleColumns: Record<string, boolean>;
  pinnedColumns: Record<string, "" | "left" | "right">;
}>();

const emit = defineEmits<{
  "toggle-column": [field: string, visible: boolean];
  "change-pinned-column": [field: string, pinned: "" | "left" | "right"];
  "reset-settings": [];
  "compact-widths": [];
}>();

const searchQuery = ref("");
const detailsElement = useTemplateRef<HTMLDetailsElement>("detailsElement");
const columnSearchInput = useTemplateRef<InstanceType<typeof IzziInput>>("columnSearchInput");
const visibleCount = computed(
  () => props.columnOptions.filter(({ field }) => props.visibleColumns[field]).length,
);
const groupedColumns = computed<Record<ColumnGroup, SettingsColumn[]>>(() => {
  const groups: Record<ColumnGroup, SettingsColumn[]> = {
    General: [],
    Pricing: [],
    Inventory: [],
    Dates: [],
  };
  const query = searchQuery.value.trim().toLocaleLowerCase();

  props.columnOptions.forEach((column) => {
    if (!query || column.label.toLocaleLowerCase().includes(query))
      groups[column.group ?? "General"].push(column);
  });

  return groups;
});
const visibleGroups = computed(() =>
  (Object.keys(groupedColumns.value) as ColumnGroup[]).filter(
    (group) => groupedColumns.value[group].length,
  ),
);

function handleToggle(event: Event): void {
  const details = event.currentTarget;

  if (details instanceof HTMLDetailsElement && details.open)
    void nextTick(() => columnSearchInput.value?.focus());
}

function toggleColumn(field: string, event: Event): void {
  const input = event.target;

  if (input instanceof HTMLInputElement) emit("toggle-column", field, input.checked);
}

function changePinnedColumn(field: string, event: Event): void {
  const select = event.target;

  if (!(select instanceof HTMLSelectElement)) return;

  const pinned = select.value;

  if (pinned === "" || pinned === "left" || pinned === "right")
    emit("change-pinned-column", field, pinned);
}

function showAllColumns(): void {
  props.columnOptions.forEach(({ field }) => emit("toggle-column", field, true));
}

function hideAllColumns(): void {
  props.columnOptions.forEach(({ field }) => emit("toggle-column", field, false));
}

function closeOnBackgroundClick(event: PointerEvent): void {
  const target = event.target;

  if (
    detailsElement.value?.open &&
    target instanceof Node &&
    !detailsElement.value.contains(target)
  )
    detailsElement.value.open = false;
}

function closeOnEscape(event: KeyboardEvent): void {
  if (event.key === "Escape" && detailsElement.value?.open) {
    detailsElement.value.open = false;
    detailsElement.value.querySelector("summary")?.focus();
  }
}

onMounted(() => {
  if (detailsElement.value?.open) void nextTick(() => columnSearchInput.value?.focus());

  document.addEventListener("pointerdown", closeOnBackgroundClick);
  document.addEventListener("keydown", closeOnEscape);
});

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", closeOnBackgroundClick);
  document.removeEventListener("keydown", closeOnEscape);
});
</script>
