<template>
  <div class="flex flex-row items-center">
    <TableMetadata class="mx-auto" />
    <ph-gear-six class="mr-4 hover:text-lime-600 cursor-pointer" :size="30" weight="duotone" @click="toggleTableSetup" />
  </div>

  <TableHeaderToggle v-if="shouldShowTableSetup" class="mb-4" :headers="visibleHeaders" @change="toggleTableHeader" />

  <table class="my-2 table-fixed w-[100%]">
    <TableHeader :headers="visibleHeaders" />
    <TableRow v-for="part in parts" :key="part.id" :part="part" :headers="visibleHeaders" />
  </table>

  <TableMetadata class="mx-auto" />
</template>

<script async lang="ts" setup>
  import { storeToRefs } from "pinia";
  import { ref } from "vue";
  import { PhGearSix } from "@phosphor-icons/vue";
  import usePartStore from "~/store/part";

  import TableRow from "~components/admin/table/TableRow.vue";
  import TableMetadata from "~components/admin/table/TableMetadata.vue";
  import TableHeader from "~components/admin/table/TableHeader.vue";
  import TableHeaderToggle from "~components/admin/table/TableHeaderToggle.vue";

  import type { VisibleHeaders } from "~components/admin/types";

  const partStore = usePartStore();
  const count = ref(25);

  partStore.fetchParts(1, count.value);
  const { parts } = storeToRefs(partStore);

  const shouldShowTableSetup = ref(false);

  const toggleTableSetup = () => {
    shouldShowTableSetup.value = !shouldShowTableSetup.value;
  };

  function toggleTableHeader(header: keyof VisibleHeaders) {
    visibleHeaders.value[header] = !visibleHeaders.value[header];
  }

  const visibleHeaders = ref<VisibleHeaders>({
    part_number: true,
    company_name: true,
    added: true,
    description: true,
    available: true,
    reserved: true,
    sold: true,
    condition: true,
    min_cost: true,
    min_price: true,
    min_order: true,
    med_cost: true,
    med_price: true,
    med_order: true,
    max_cost: true,
    max_price: true,
    max_order: true,
    lead_time: true,
    quote_type: true,
    tag: true,
  });
</script>

<style>
  table, tr, td {
    @apply border border-gray-600 border-collapse;
  }
</style>
