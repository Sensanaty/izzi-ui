<template>
  <button
    ref="button"
    :type="type"
    :disabled="disabled"
    class="active-focus:text-emerald-600 w-fit rounded border bg-neutral-900 px-2 py-0.5
     font-semibold transition-colors
     hover:bg-neutral-800 hover:text-emerald-600
     active:bg-neutral-700 active:text-emerald-400 disabled:cursor-not-allowed
     disabled:bg-neutral-950 disabled:text-white/20"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

type BaseButtonProps = {
  type?: HTMLButtonElement["type"];

  disabled?: boolean;
  autofocus?: boolean;
};

const props = withDefaults(defineProps<BaseButtonProps>(), {
  type: "button",
});


const button = ref<HTMLButtonElement | null>();
onMounted(() => {
  if (props?.autofocus && button.value) {
    button.value.focus();
  }
});
</script>
