<template>
  <AppHeader />
  <RouterView />
  <NotificationContainer />
</template>

<script setup lang="ts">
  import { provide } from "vue";
  import AppHeader from "~components/base/AppHeader.vue";
  import NotificationContainer from "~components/notifications/NotificationContainer.vue";

  const provideValue = import.meta?.env?.VITE_CURRENT_COMPANY as "izzi" | "dap" | undefined;

  provide("company", provideValue ?? "izzi");
</script>
