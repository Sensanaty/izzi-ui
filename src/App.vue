<template>
  <RouterView />

  <NotificationContainer />
</template>

<script setup lang="ts">
  import { onMounted } from "vue";
  import { useHead } from "@vueuse/head";
  import useAuthStore from "#store/auth";
  import { useRouter } from "vue-router";

  const auth = useAuthStore();
  const router = useRouter();

  onMounted(() => {
    if (!auth.loggedIn && (auth.checkToken())) {
      const token = window.localStorage.getItem("token") || auth.token;
      auth.setToken(token);
    }
  });

  auth.$subscribe((mutation, state) => {
    if (state.loggedIn === false && router.currentRoute.value.meta.admin === true) {
      router.push("/login");
    }
  });

  useHead({
    title: "Izzicup",
    meta: [
      { name: "description", content: "IZZI CUP D.O.O is a limited liability company based in Belgrade, Serbia." }
    ]
  });
</script>
