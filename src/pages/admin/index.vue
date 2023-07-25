<template>
  <PartTable />
</template>

<script lang="ts" setup>
  import { useHead } from "@vueuse/head";

  import PartTable from "~components/admin/PartTable.vue";

  useHead({
    title: "Izzicup Admin"
  });
</script>
