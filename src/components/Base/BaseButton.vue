<template>
  <button
    ref="button"
    :type="type"
    :disabled="disabled"
    class="w-fit font-semibold rounded border px-2 py-0.5 bg-neutral-900
     hover:bg-neutral-800 hover:text-emerald-600
     active:bg-neutral-700 active:text-emerald-400
     disabled:bg-neutral-950 disabled:text-white/20 disabled:cursor-not-allowed
     active-focus:text-emerald-600 transition-colors"
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
