<template>
  <RouterView />

  <NotificationContainer />
</template>

<script setup lang="ts">
  import { onMounted } from "vue";
  import { useHead } from "@vueuse/head";
  import useAuthStore from "#store/auth";
  import NotificationContainer from "#components/NotificationContainer.vue";

  const auth = useAuthStore();

  onMounted(() => {
    if (!auth.loggedIn && (auth.checkToken())) {
      const token = window.localStorage.getItem("token") || auth.token;
      auth.setToken(token);
    }
  });

  useHead({
    title: "Izzicup",
    meta: [
      { name: "description", content: "IZZI CUP D.O.O is a limited liability company based in Belgrade, Serbia." }
    ]
  });
</script>
