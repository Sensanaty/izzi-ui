<template>
  <div class="group relative">
    <PhWrench weight="fill" class="cursor-pointer hover:text-emerald-600" />

    <div
      class="absolute left-1.5 z-10 hidden w-max flex-col gap-y-1.5 rounded-md border bg-neutral-950 p-2 text-sm group-hover:flex"
      :class="placement === 'top' ? 'bottom-2' : 'top-2'"
    >
      <button
        class="flex items-center rounded-md px-2 py-1 transition-colors hover:bg-neutral-800 hover:text-emerald-600 active:bg-neutral-700"
        @click="emit('copyQuote')"
      >
        <div class="mr-2">
          <PhQuotes />
        </div>
        Copy Quote Details
      </button>

      <button
        class="flex items-center rounded-md px-2 py-1 transition-colors hover:bg-neutral-800 hover:text-emerald-600 active:bg-neutral-700"
        @click="emit('copyFull')"
      >
        <div class="mr-2">
          <PhClipboardText />
        </div>
        Copy Full Details
      </button>

      <button
        class="flex items-center rounded-md px-2 py-1 transition-colors hover:bg-neutral-800 hover:text-emerald-600 active:bg-neutral-700"
        @click="emit('edit')"
      >
        <div class="mr-2">
          <PhPencil />
        </div>
        {{ scope === 'all' ? 'Edit Parts' : 'Edit Part' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhClipboardText, PhPencil, PhQuotes, PhWrench } from "@phosphor-icons/vue";

type Props = {
  placement: "top" | "bottom";
  scope: "all" | "individual";
};

defineProps<Props>();

const emit = defineEmits<{
  copyQuote: [];
  copyFull: [];
  edit: [];
}>();
</script>
