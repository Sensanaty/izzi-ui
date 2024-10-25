<template>
  <PublicLayout v-if="!authStore.loggedIn">
    <RouterView />
  </PublicLayout>

  <AdminLayout v-else>
    <RouterView />
  </AdminLayout>

  <NotificationContainer />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted } from "vue";
import PublicLayout from "@/views/layouts/PublicLayout.vue";
import useAuthStore from "@/stores/auth";
import useAuthApi from "@/api/auth";

const AdminLayout = defineAsyncComponent(() => import("@/views/layouts/AdminLayout.vue"));
const NotificationContainer = defineAsyncComponent(() => import("@/components/Notifications/NotificationContainer.vue"));

const authStore = useAuthStore();

const { authenticate } = useAuthApi();
onMounted(async () => {
  if (localStorage.getItem("token")) {
    authenticate(true).then((payload) => {
      authStore.setAuthFromLocal();

      if (payload.token) {
        authStore.setToken(payload.token);
      }
    }).catch(() => {
      authStore.logout();
    });
  }
});
</script>
