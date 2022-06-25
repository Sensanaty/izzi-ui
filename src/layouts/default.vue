<template>
  <NavHeader />

  <div class="page-wrapper">
    <RouterView />
  </div>
</template>

<script setup>
  import NavHeader from "~/components/NavHeader.vue";
</script>
