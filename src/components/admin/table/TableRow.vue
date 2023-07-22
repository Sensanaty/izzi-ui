<template class="flex flex-row">
  <tbody>
    <tr>
      <td>{{ part.part_number }}</td>
      <td>{{ part.company_name }}</td>
      <td>{{ part.added }}</td>
      <td>{{ part.description }}</td>
      <td>{{ part.available }}</td>
      <td>{{ part.reserved }}</td>
      <td>{{ part.sold }}</td>
      <td>{{ part.condition }}</td>
      <td>{{ part.min_cost }}</td>
      <td>{{ part.min_price }}</td>
      <td>{{ part.min_order }}</td>
      <td>{{ part.med_cost }}</td>
      <td>{{ part.med_price }}</td>
      <td>{{ part.med_order }}</td>
      <td>{{ part.max_cost }}</td>
      <td>{{ part.max_price }}</td>
      <td>{{ part.max_order }}</td>
      <td>{{ part.lead_time }}</td>
      <td>{{ part.quote_type }}</td>
      <td>{{ part.tag }}</td>
    </tr>
  </tbody>
</template>

<script lang="ts" setup>
  import Part from "~/types/store/part";

  defineProps<{
    part: Part
  }>();
</script>
