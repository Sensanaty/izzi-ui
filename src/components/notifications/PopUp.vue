<template>
  <div
    class="min-w-[350px] text-sm rounded mt-3 px-3 py-4 bg-neutral-900 text-white z-50 cursor-pointer border-2 border-transparent border-solid hover:bg-neutral-800"
    :class="type"
    @click.prevent="destroy"
  >
    <p>{{ message }}</p>
  </div>
</template>

<script lang="ts" setup>
  import Notification from "~/types/store/notification";
  import { onMounted } from "vue";

  const props = defineProps<{
    index: number,
    type: Notification["type"],
    message: Notification["message"],
    autoHide: Notification["autoHide"],
    duration: Notification["duration"]
  }>();

  const emit = defineEmits(["destroyNotification"]);

  onMounted(() => {
    setTimeout(destroy, props.duration);
  });

  function destroy() {
    emit("destroyNotification", props.index);
  }
</script>

<style scoped>
  .warn { @apply border-amber-400 }
  .info { @apply border-blue-400 }
  .succ { @apply border-emerald-600 }
  .dang { @apply border-orange-700 }
</style>
