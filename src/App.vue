<template>
  <MainLayout>
    <RouterView />
  </MainLayout>

  <NotificationContainer />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import MainLayout from "@/views/layouts/MainLayout.vue";
import { useHead } from "@unhead/vue";

const NotificationContainer = defineAsyncComponent(() => import("@/components/Notifications/NotificationContainer.vue"));

useHead({ titleTemplate: "Izzicup - %s" });
</script>
