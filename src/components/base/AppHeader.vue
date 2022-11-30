<template>
  <header class="flex items-center bg-neutral-800 w-full h-14 px-4">
    <h1 class="font-bold text-center text-2xl hover:text-amber-400">
      <RouterLink class="p-0" :to="auth.loggedIn ? '/admin' : '/'">IZZICUP</RouterLink>
    </h1>

    <BaseButton class="ml-auto">
      <RouterLink to="/login">LOGIN</RouterLink>
    </BaseButton>
  </header>
</template>

<script setup lang="ts">
  import useAuthStore from "~/store/auth";
  import BaseButton from "~components/base/BaseButton.vue";

  const auth = useAuthStore();
</script>
