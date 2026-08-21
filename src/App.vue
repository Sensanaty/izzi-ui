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

    <main>
      <RouterView />
    </main>
  </template>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AppHeader from "@/views/layout/AppHeader.vue";

const auth = useAuthStore();
</script>
