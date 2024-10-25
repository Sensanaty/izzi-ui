<template>
  <div class="flex flex-col fixed bottom-5 left-4 max-w-96 z-10">
    <NotificationBox v-for="notification in notifications" :key="notification.id" :notification="notification" />
  </div>
</template>

<script setup lang="ts">
import NotificationBox from "@/components/Notifications/NotificationBox.vue";
import useNotificationStore from "@/stores/notification";
import { storeToRefs } from "pinia";

const { notifications } = storeToRefs(useNotificationStore());
</script>
