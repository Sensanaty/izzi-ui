<template>
  <details class="border-border bg-surface-raised w-fit rounded-sm border-2 sm:ml-auto">
    <summary class="text-text cursor-pointer px-4 py-2 text-base font-bold">
      Column Settings
    </summary>

    <div class="border-border grid gap-3 border-t p-4 sm:grid-cols-2 lg:grid-cols-3">
      <label
        v-for="column in columnOptions"
        :key="column.field"
        class="text-text flex items-center gap-3 text-base"
      >
        <input
          :checked="visibleColumns[column.field]"
          class="accent-primary"
          type="checkbox"
          @change="toggleColumn(column.field, $event)"
        />

        <span>{{ column.label }}</span>

        <select
          :value="pinnedColumns[column.field]"
          :aria-label="`Freeze ${column.label}`"
          class="bg-input border-border ml-auto min-h-8 rounded-sm border px-2 py-1 text-sm"
          @change="changePinnedColumn(column.field, $event)"
        >
          <option value="">None</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </label>

      <IzziButton
        class="sm:col-span-2 lg:col-span-3"
        size="sm"
        variant="outline"
        @click="emit('reset-settings')"
      >
        Reset to default
      </IzziButton>
    </div>
  </details>
</template>

<script setup lang="ts">
import IzziButton from "@/components/ui/IzziButton.vue";

type ColumnOption = {
  field: string;
  label: string;
};

type Props = {
  columnOptions: readonly ColumnOption[];
  visibleColumns: Record<string, boolean>;
  pinnedColumns: Record<string, "" | "left" | "right">;
};

defineProps<Props>();
const emit = defineEmits<{
  "toggle-column": [field: string, visible: boolean];
  "change-pinned-column": [field: string, pinned: "" | "left" | "right"];
  "reset-settings": [];
}>();

function toggleColumn(field: string, event: Event): void {
  const input = event.target;

  if (input instanceof HTMLInputElement) emit("toggle-column", field, input.checked);
}

function changePinnedColumn(field: string, event: Event): void {
  const select = event.target;

  if (select instanceof HTMLSelectElement) {
    const pinned = select.value;

    if (pinned === "" || pinned === "left" || pinned === "right")
      emit("change-pinned-column", field, pinned);
  }
}
</script>
