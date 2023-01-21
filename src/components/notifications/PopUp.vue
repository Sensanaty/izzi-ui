<template>
  <div :class="type" @click.prevent="$emit('destroyNotification', index)">
    <p>{{ message }}</p>
  </div>
</template>

<script lang="ts" setup>
  import Notification from "~/types/store/notification";

  defineProps<{
    index: number,
    type: Notification["type"],
    message: Notification["message"],
    autoHide: Notification["autoHide"],
    duration: Notification["duration"]
  }>();

  defineEmits(["destroyNotification"]);
</script>

<style scoped>
  div {
    @apply min-w-[350px] text-sm rounded mt-3 px-3 py-4 bg-neutral-900 text-white z-50 cursor-pointer border-2 border-transparent border-solid hover:bg-neutral-800;
  }

  .warn { @apply border-amber-400 }
  .info { @apply border-blue-400 }
  .succ { @apply border-emerald-600 }
  .dang { @apply border-orange-700 }
</style>
