<template>
  <div class="absolute left-0">
    <div class="group relative p-1">
      <PhToolbox size="20" weight="fill" class="cursor-pointer hover:text-emerald-500 group-hover:text-emerald-500" />

      <div class="absolute left-1.5 z-10 hidden w-max flex-col gap-y-1.5 rounded-md border-2 border-emerald-500 bg-neutral-950 p-2 text-sm group-hover:flex">
        <button
          class="flex rounded p-1 font-bold transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:text-neutral-600"
          @click="emit('export', 'all')"
        >
          Export all to CSV
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhToolbox } from "@phosphor-icons/vue";

const emit = defineEmits<{
  (e: "export", option: "all"): void;
}>();
</script>
