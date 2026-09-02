<template>
  <button
    type="button"
    class="mb-3 w-full cursor-pointer rounded-sm border-2 bg-surface-raised px-3 py-2 text-start font-mono text-sm font-semibold text-text last:mb-0 hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring active:bg-surface"
    :class="notification.kind"
    :aria-label="`Dismiss notification: ${notification.text}`"
    @click="removeNotification(notification.id)"
  >
    {{ notification.text }}
  </button>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useNotificationStore } from "@/stores/notification";

import type { Notification } from "@/stores/notification";

const props = defineProps<{ notification: Notification }>();

const { removeNotification } = useNotificationStore();

let autoHideTimeout: number | undefined;

onMounted(() => {
  if (props.notification.autoHide) {
    autoHideTimeout = window.setTimeout(() => removeNotification(props.notification.id), 5000);
  }
});

onUnmounted(() => {
  if (autoHideTimeout !== undefined) {
    window.clearTimeout(autoHideTimeout);
  }
});
</script>

<style scoped>
@reference "#style.css";

.w {
  @apply border-amber-500;
}

.d {
  @apply border-danger;
}

.i {
  @apply border-teal-500;
}

.s {
  @apply border-success;
}
</style>
