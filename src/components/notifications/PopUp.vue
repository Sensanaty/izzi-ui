<template>
  <div
    class="min-w-[350px] text-sm rounded mt-3 bg-neutral-900 text-white z-50 cursor-pointer border-4 pt-0 px-3 pb-3 border-transparent border-solid hover:bg-neutral-800"
    :class="type"
    @click.prevent="destroy"
  >
    <p>{{ message }}</p>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from "vue";

  import Notification from "~/types/store/notification";

  const props = defineProps<{
    index: number,
    type: Notification["type"],
    message: Notification["message"],
    autoHide: Notification["autoHide"],
    duration: Notification["duration"]
  }>();

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
</style>
