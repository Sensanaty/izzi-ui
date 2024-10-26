<template>
  <div class="flex flex-col fixed bottom-5 left-4 max-w-96 z-10">
    <TransitionGroup name="notification-slide">
      <NotificationBox v-for="notification in notifications" :key="notification.id" :notification="notification" />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import NotificationBox from "@/components/Notifications/NotificationBox.vue";
import useNotificationStore from "@/stores/notification";
import { storeToRefs } from "pinia";

const { notifications } = storeToRefs(useNotificationStore());
</script>

<style scoped lang="postcss">
.notification-slide-enter-active,
.notification-slide-leave-active {
  transition: all 100ms ease-in-out;
}

.notification-slide-enter-from {
  opacity: 0;
  transform: translateX(-500px);
}

.notification-slide-leave-to {
  opacity: 0;
  transform: translateX(-500px);
}

.notification-slide-move {
  transition: transform 100ms ease-in-out;
}
</style>
