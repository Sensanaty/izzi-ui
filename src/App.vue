<template>
  <PublicLayout>
    <RouterView />
  </PublicLayout>

  <NotificationContainer />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import PublicLayout from "@/views/layouts/PublicLayout.vue";

const NotificationContainer = defineAsyncComponent(() => import("@/components/Notifications/NotificationContainer.vue"));
</script>
