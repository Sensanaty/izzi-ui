<template>
  <div
    class="fixed right-4 bottom-5 left-4 z-10 flex w-auto max-w-96 flex-col"
    aria-label="Notifications"
    aria-live="polite"
  >
    <TransitionGroup name="notification-slide" tag="div">
      <NotificationBox
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import NotificationBox from "@/components/notifications/NotificationBox.vue";
import { useNotificationStore } from "@/stores/notification";

const { notifications } = storeToRefs(useNotificationStore());
</script>

<style scoped>
.notification-slide-enter-active,
.notification-slide-leave-active {
  transition:
    opacity 150ms ease,
    transform 150ms ease !important;
}

.notification-slide-enter-from,
.notification-slide-leave-to {
  opacity: 0;
  transform: translateX(-1rem);
}

.notification-slide-move {
  transition: transform 150ms ease !important;
}
</style>
