<template>
  <thead class="w-full bg-neutral-800">
    <tr class="w-full">
      <td class="w-7" />
      <td v-if="headers.part_number" class="w-[100px]">Part Number</td>
      <td v-if="headers.company_name">Owner</td>
      <td v-if="headers.added">Date Added</td>
      <td v-if="headers.description" class="w-[200px]">Description</td>
      <td v-if="headers.available" class="w-16">Available</td>
      <td v-if="headers.reserved" class="w-16">Reserved</td>
      <td v-if="headers.sold" class="w-14">Sold</td>
      <td v-if="headers.condition" class="w-15">Condition</td>
      <td v-if="headers.min_cost" class="w-14">Cost 1</td>
      <td v-if="headers.min_price" class="w-14">Sales 1</td>
      <td v-if="headers.min_order" class="w-14">Order 1</td>
      <td v-if="headers.med_cost" class="w-14">Cost 2</td>
      <td v-if="headers.med_price" class="w-14">Sales 2</td>
      <td v-if="headers.med_order" class="w-14">Order 2</td>
      <td v-if="headers.max_cost" class="w-14">Cost 3</td>
      <td v-if="headers.max_price" class="w-14">Sales 3</td>
      <td v-if="headers.max_order" class="w-14">Order 3</td>
      <td v-if="headers.lead_time">Lead Time</td>
      <td v-if="headers.quote_type">Quote Type</td>
      <td v-if="headers.tag" class="w-[175px]">Tag</td>
    </tr>
  </thead>
</template>

<script lang="ts" setup>
  import { VisibleHeaders } from "~components/admin/types";

  defineProps<{
    headers: VisibleHeaders,
  }>();
</script>

<style scoped>
td {
  @apply text-center text-sm;
}
</style>
