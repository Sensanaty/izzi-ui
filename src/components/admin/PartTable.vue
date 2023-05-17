<template>
  <table class="flex flex-col">
    <TableRow v-for="part in parts" :key="part.id" :part="part" />
    <TableMetadata class="mx-auto" />
  </table>
</template>

<script async lang="ts" setup>
  import { storeToRefs } from "pinia";
  import { ref } from "vue";
  import usePartStore from "~/store/part";
  import TableRow from "~components/admin/table/TableRow.vue";
  import TableMetadata from "~components/admin/table/TableMetadata.vue";

  const partStore = usePartStore();
  const count = ref(25);

  if (localStorage.getItem("partCountParam")) {
    count.value = parseInt(localStorage.getItem("partCountParam"));
  }

  partStore.fetchParts(1, count.value);
  const { parts } = storeToRefs(partStore);
</script>
