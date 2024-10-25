<template>
  <PublicLayout v-if="true">
    <RouterView />
  </PublicLayout>

  <AdminLayout v-else-if="false">
    <RouterView />
  </AdminLayout>

  <NotificationContainer />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import PublicLayout from "@/views/layouts/PublicLayout.vue";

const AdminLayout = defineAsyncComponent(() => import("@/views/layouts/AdminLayout.vue"));
const NotificationContainer = defineAsyncComponent(() => import("@/components/Notifications/NotificationContainer.vue"));
</script>
