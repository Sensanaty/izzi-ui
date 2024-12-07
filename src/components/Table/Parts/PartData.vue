<template>
  <div class="w-full">
    <div class="w-full overflow-x-auto rounded-md border">
      <table class="w-full min-w-full border-collapse bg-neutral-900">
        <thead class="bg-neutral-950">
          <tr class="border-b">
            <th class="select-none px-2">
              <div class="flex size-full items-center justify-center">
                <input
                  type="checkbox"
                  :checked="selectedRows.size === partRows.length"
                  :indeterminate="selectedRows.size > 0 && selectedRows.size < partRows.length"
                  class="mr-1.5 cursor-pointer accent-emerald-600 transition-colors"
                  @change="toggleAll"
                >

                <PartTableTools
                  v-if="anySelected"
                  scope="all"
                  placement="bottom"
                  @copy-quote="copyDetails('bulk', 'quote')"
                  @copy-full="copyDetails('bulk', 'full')"
                  @edit="editPart('bulk')"
                />
              </div>
            </th>

            <th
              v-for="header in headers"
              :key="header.key"
              class="whitespace-nowrap border-x px-2 py-1 text-left font-mono text-sm text-neutral-200"
            >
              {{ header.label }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(partRow, partRowIndex) in partRows"
            :key="String(partRow.id)"
            class="border transition-colors hover:bg-neutral-800"
            :class="{ '!bg-emerald-600/15': isRowSelected(partRow.id) }"
          >
            <td class="select-none border-x px-2" @click.self.prevent="toggleRow(partRow.id)">
              <div class="flex items-center justify-center">
                <input
                  type="checkbox"
                  :checked="isRowSelected(partRow.id)"
                  class="mr-1.5 cursor-pointer accent-emerald-600 transition-colors"
                  @change="toggleRow(partRow.id)"
                >

                <PartTableTools
                  v-if="!anySelected"
                  scope="individual"
                  :placement="partRowIndex > partRows.length - 3 ? 'top' : 'bottom'"
                  @copy-quote="copyDetails('individual', 'quote', partRowIndex)"
                  @copy-full="copyDetails('individual', 'full', partRowIndex)"
                  @edit="editPart('individual', partRowIndex)"
                />
              </div>
            </td>


            <td
              v-for="(value, key, index) in partRow"
              :key="`${value}${Math.random()}`"
              v-tooltip
              class="relative max-w-lg border-x px-2 py-1 font-mono text-sm hover:bg-neutral-700"
            >
              <p class="line-clamp-2" :class="getDataClass(index)">
                {{ key === 'updated_at' || key === 'created_at' ? formatDate(value as string) : value }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { generateFieldsFromSchema } from "@/utils/zodUtils.ts";
import { type Part, PartSchema } from "@/schemas";
import { computed, ref } from "vue";
import vTooltip from "@/directives/tooltip.ts";
import { copyText, formatDate } from "@/utils/stringUtils.ts";
import PartTableTools from "@/components/Table/Parts/PartTableTools.vue";
import useNotificationStore from "@/stores/notification.ts";

type HeaderRow<T> = { key: keyof T; label: string };

const props = defineProps<{
  parts: Part[];
  selectMode?: boolean;
}>();

const emit = defineEmits<{
  rowSelected: [ids: Array<bigint | number>];
  selectionCleared: [];
}>();

const { createNotification } = useNotificationStore();

// @ts-expect-error The type checker is tripping
const headers: HeaderRow<Part>[] = generateFieldsFromSchema(PartSchema, {
  exclude: ["id", "added", "company_id"],
  extraFields: [
    { key: "company_name", afterKey: "part_number", label: "Company Name" },
    { key: "id", afterKey: "updated_at", label: "ID" },
  ],
});

const partRows = computed(() => {
  return props.parts.map(part => {
    const row = {} as Part;

    headers.forEach(({ key }) => {
      // @ts-expect-error Couldn't be bothered to figure out this error
      row[key] = part[key];
    });

    return row;
  });
});

function getDataClass(index: number) {
  // Exclude the part_number, company_name, and timestamps from text wrapping
  if ([0, partRows.value.length, partRows.value.length + 1].includes(index)) {
    return "whitespace-nowrap";
  }
}

const selectedRows = ref<Set<bigint | number>>(new Set());
const selectedRowArray = computed(() => Array.from(selectedRows.value));

const allSelected = computed(() => selectedRows.value.size === partRows.value.length);
const anySelected = computed(() => selectedRows.value.size > 0);

function isRowSelected(id: bigint | number): boolean {
  return selectedRows.value.has(id);
}

function toggleRow(id: bigint | number) {
  if (selectedRows.value.has(id)) {
    selectedRows.value.delete(id);
  } else {
    selectedRows.value.add(id);
  }

  emit("rowSelected", selectedRowArray.value);
}

function toggleAll() {
  if (allSelected.value) {
    selectedRows.value.clear();
  } else {
    selectedRows.value = new Set(partRows.value.map(row => row.id));
  }

  emit("rowSelected", selectedRowArray.value);
}

type ActionScope = "bulk" | "individual";

function formatPartDetails(part: Part, filteredHeaders: HeaderRow<Part>[]): string {
  return filteredHeaders
    .map(({ key, label }) => {
      const value = part[key];
      const displayValue = (!value) ? "N/A" : value;

      return `${label}: ${displayValue}`;
    })
    .join("\n");
}

function copyDetails(scope: ActionScope, type: "quote" | "full", index?: number) {
  let filteredHeaders = headers;

  if (type === "quote") {
    filteredHeaders = filteredHeaders.filter(({ key }) => {
      return !["id", "company_name", "min_cost", "med_cost", "max_cost", "internal_note", "created_at", "updated_at"].includes(key);
    });
  }

  let clipboardText = "";

  if (scope === "bulk") {
    clipboardText = selectedRowArray.value
      .map(partId => {
        const part = partRows.value.find((part) => part.id === partId);

        return part ? formatPartDetails(part, filteredHeaders) : "";
      })
      .filter(Boolean)
      .join("\n\n==========\n\n");
  } else if (scope === "individual") {
    clipboardText = formatPartDetails(partRows.value[index!], filteredHeaders);
  }

  copyText(clipboardText)
    .then(() => {
      const copyType = type === "quote" ? "Quote Details" : "Part Details";
      createNotification(`${copyType} Copied To Clipboard`);
    })
    .catch(err => createNotification(err, { kind: "d" }));
}

function editPart(scope: ActionScope, index?: number) {
  if (scope === "bulk") {
    createNotification("Bulk Editing Is WIP");
    return;
  }

  createNotification("Editing Is WIP");
}
</script>

<style scoped lang="postcss">
th::selection, p::selection {
  @apply bg-emerald-800 text-white;
}
</style>
