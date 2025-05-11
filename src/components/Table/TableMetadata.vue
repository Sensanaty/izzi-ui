<template>
  <div class="relative flex items-center">
    <div class="mx-auto flex items-center gap-x-1.5 border" :class="roundedTop ? 'rounded-t-lg border-b-0' : 'rounded-b-lg border-t-0'">
      <button :disabled="isFetching || !metadata.prev" @click.prevent="emit('navigate', 'first')">
        <PhCaretDoubleLeft weight="fill" />
      </button>

      <button :disabled="isFetching || !metadata.prev" @click.prevent="emit('navigate', 'prev')">
        <PhCaretLeft weight="fill" />
      </button>

      <BaseInput
        :id="searchId"
        v-model="localPage"
        :disabled="isFetching"
        class="w-12"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        size="xsmall"
        @keydown.enter="goToPage"
        @blur="goToPage"
      />

      <button :disabled="isFetching || !metadata.next" @click.prevent="emit('navigate', 'next')">
        <PhCaretRight weight="fill" />
      </button>

      <button :disabled="isFetching || !metadata.next" @click.prevent="emit('navigate', 'last')">
        <PhCaretDoubleRight weight="fill" />
      </button>
    </div>

    <TableToolbox v-if="shouldShowToolbox" @export="(option) => emit('export', option)" />
  </div>
</template>

<script setup lang="ts">
import { PhCaretLeft, PhCaretDoubleLeft, PhCaretDoubleRight, PhCaretRight, PhToolbox } from "@phosphor-icons/vue";
import { ref, useId, watch } from "vue";

import type { PaginationMetadata } from "@/composables/useFetch.ts";
import TableToolbox from "@/components/Table/TableToolbox.vue";

type Props = {
  metadata: PaginationMetadata;
  isFetching: boolean;
  roundedTop?: boolean;
  shouldShowToolbox?: boolean;
};

const searchId = useId();

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "navigate", direction: "first" | "prev" | "next" | "last"): void;
  (e: "goto", page: number): void;
  (e: "export", option: "all"): void;
}>();

const localPage = ref(props?.metadata?.page ?? 1);

watch(() => props.metadata.page, (newPage) => localPage.value = newPage);

function goToPage() {
  if (isNaN(localPage.value)) {
    localPage.value = props.metadata.page;
    return;
  }

  if (localPage.value !== props.metadata.page && localPage.value > 0) {
    emit("goto", localPage.value);
  }
}
</script>

<style scoped lang="postcss">
button {
  @apply flex text-lg rounded transition-colors p-1 hover:bg-neutral-800 disabled:text-neutral-600 disabled:cursor-not-allowed;
}
</style>
