<template>
  <div
    class="text-text-muted flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between"
  >
    <div class="flex flex-wrap items-center gap-2">
      <span>{{ selectedCount }} selected · {{ totalItems }} total {{ itemLabel }}</span>

      <label class="flex items-center gap-2" :for="`${idPrefix}-page-size`">
        Fetch
        <select
          :id="`${idPrefix}-page-size`"
          :value="pageSize"
          class="bg-input border-border rounded-sm border px-2 py-1"
          @change="changePageSize"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
        </select>
        rows
      </label>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <IzziButton
        variant="outline"
        :disabled="!hasPreviousPage || disabled"
        @click="emit('go-to-page', 1)"
      >
        First
      </IzziButton>

      <IzziButton
        variant="outline"
        :disabled="!hasPreviousPage || disabled"
        @click="emit('go-to-page', currentPage - 1)"
      >
        Previous
      </IzziButton>

      <form class="flex items-center gap-1" @submit.prevent="emit('go-to-page', pageInput)">
        <label class="sr-only" :for="`${idPrefix}-page-number`">Page number</label>

        <input
          :id="`${idPrefix}-page-number`"
          :value="pageInput"
          class="bg-input border-border w-16 rounded-sm border px-2 py-1 text-center"
          min="1"
          :max="lastPage"
          type="number"
          @input="updatePageInput"
          @change="goToPage"
        />

        <span>of {{ lastPage }}</span>
      </form>

      <IzziButton
        variant="outline"
        :disabled="!hasNextPage || disabled"
        @click="emit('go-to-page', currentPage + 1)"
      >
        Next
      </IzziButton>

      <IzziButton
        variant="outline"
        :disabled="!hasNextPage || disabled"
        @click="emit('go-to-page', lastPage)"
      >
        Last
      </IzziButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import IzziButton from "@/components/ui/IzziButton.vue";

defineProps<{
  idPrefix: string;
  currentPage: number;
  lastPage: number;
  pageInput: number;
  pageSize: number;
  pageSizeOptions: number[];
  selectedCount: number;
  totalItems: number;
  itemLabel: string;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  disabled: boolean;
}>();

const emit = defineEmits<{
  "go-to-page": [page: number];
  "change-page-size": [size: number];
  "update:page-input": [page: number];
}>();

function changePageSize(event: Event): void {
  const select = event.target;

  if (select instanceof HTMLSelectElement) emit("change-page-size", Number(select.value));
}

function updatePageInput(event: Event): void {
  const input = event.target;

  if (input instanceof HTMLInputElement) emit("update:page-input", input.valueAsNumber);
}

function goToPage(event: Event): void {
  const input = event.target;

  if (input instanceof HTMLInputElement) emit("go-to-page", input.valueAsNumber);
}
</script>
