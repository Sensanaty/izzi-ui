<template>
  <TableMetadata class="mx-auto" />

  <table class="my-2 table-fixed w-[100%]">
    <TableHeader />
    <TableRow v-for="part in parts" :key="part.id" :part="part" />
  </table>

  <TableMetadata class="mx-auto" />
</template>

<script async lang="ts" setup>
  import { storeToRefs } from "pinia";
  import { ref } from "vue";
  import usePartStore from "~/store/part";

  import TableRow from "~components/admin/table/TableRow.vue";
  import TableMetadata from "~components/admin/table/TableMetadata.vue";
  import TableHeader from "~components/admin/table/TableHeader.vue";

  const partStore = usePartStore();
  const count = ref(25);

  partStore.fetchParts(1, count.value);
  const { parts } = storeToRefs(partStore);
</script>

<style>
  table, tr, td {
    @apply border border-gray-600 border-collapse;
  }
</style>
