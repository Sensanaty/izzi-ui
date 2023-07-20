<template>
  <div
    class="min-w-[350px] text-sm rounded mt-3 bg-neutral-900 text-white z-50 cursor-pointer border-4 pt-0 px-3 pb-3 border-transparent border-solid hover:bg-neutral-800"
    :class="type"
    @click.prevent="destroy"
  >
    <div v-if="autoHide" class="timer relative mb-3 -ml-4">
      <div class="absolute bg-green-500 w-[1px] min-h-[3px]" />
      <Motion :animate="transformScale" :transition="animationDuration" :initial="true" class="middle absolute left-[1px] bg-green-500 w-[1px] min-h-[3px]" />
    </div>

    <p>{{ message }}</p>
  </div>
</template>

<script lang="ts" setup>
  import Notification from "~/types/store/notification";
  import { onMounted } from "vue";
  import { Motion } from "motion/vue";

  import type { AnimationOptionsWithOverrides } from "motion";

  const props = defineProps<{
    index: number,
    type: Notification["type"],
    message: Notification["message"],
    autoHide: Notification["autoHide"],
    duration: Notification["duration"]
  }>();

  const transformScale = { transform: ["scaleX(300)","scaleX(0)"] };
  const animationDuration = { duration: props.duration / 1000, easing: "linear" } as AnimationOptionsWithOverrides;

  const emit = defineEmits(["destroyNotification"]);

  onMounted(() => {
    if (!props.autoHide) { return; }

    setTimeout(destroy, props.duration);
  });

  function destroy() {
    emit("destroyNotification", props.index);
  }
</script>

<style scoped>
  .middle { transform-origin: left; }

  .warn { @apply border-b-amber-400 }
  .info { @apply border-b-blue-400 }
  .succ { @apply border-b-emerald-600 }
  .dang { @apply border-b-orange-700 }

  .warn .timer > div { @apply bg-amber-400 }
  .info .timer > div { @apply bg-blue-400 }
  .succ .timer > div { @apply bg-emerald-600 }
  .dang .timer > div { @apply bg-orange-700 }
</style>
