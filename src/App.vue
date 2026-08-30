<template>
  <div
    v-if="auth.isInitializing"
    class="text-text-muted flex min-h-screen items-center justify-center"
    role="status"
  >
    Restoring your session...
  </div>

  <template v-else>
    <AppHeader v-if="auth.isAuthenticated" />

    <main class="flex w-full flex-col gap-4 px-4 py-6 lg:px-6">
      <RouterView />
    </main>
  </template>

  <NotificationContainer />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AppHeader from "@/views/layout/AppHeader.vue";

const NotificationContainer = defineAsyncComponent(
  () => import("@/components/notifications/NotificationContainer.vue"),
);

const auth = useAuthStore();
</script>
