<template>
  <MainLayout>
    <RouterView />
  </MainLayout>

  <NotificationContainer />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted } from "vue";
import MainLayout from "@/views/layouts/MainLayout.vue";

const NotificationContainer = defineAsyncComponent(() => import("@/components/Notifications/NotificationContainer.vue"));
</script>
