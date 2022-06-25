<template>
  <RouterView />
</template>

<script setup lang="ts">
  import { useHead } from "@vueuse/head";

  useHead({
    title: "Izzicup",
    meta: [
      { name: "description", content: "IZZI CUP D.O.O is a limited liability company based in Belgrade, Serbia." }
    ]
  });
</script>
