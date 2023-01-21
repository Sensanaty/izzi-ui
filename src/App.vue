<template>
  <AppHeader />
  <RouterView />
  <NotificationContainer />
</template>

<script setup lang="ts">
  import AppHeader from "~components/base/AppHeader.vue";
  import NotificationContainer from "~components/notifications/NotificationContainer.vue";
</script>
