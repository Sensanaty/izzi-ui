<template class="flex flex-row">
  <tbody>
    <tr>
      <td @click="copy" class="cursor-pointer active:text-green-600 transition-colors">
        <ph-clipboard-text class="mx-auto" :size="15" weight="fill" />
      </td>
      <td v-if="headers.part_number" class="px-1">{{ part.part_number }}</td>
      <td v-if="headers.company_name">{{ part.company_name }}</td>
      <td v-if="headers.added" class="text-center">{{ part.added }}</td>
      <td v-if="headers.description" class="px-1">{{ part.description }}</td>
      <td v-if="headers.available" class="text-center">{{ part.available }}</td>
      <td v-if="headers.reserved" class="text-center">{{ part.reserved }}</td>
      <td v-if="headers.sold" class="text-center">{{ part.sold }}</td>
      <td v-if="headers.condition" class="text-center">{{ part.condition }}</td>
      <td v-if="headers.min_cost" class="text-center">{{ part.min_cost }}</td>
      <td v-if="headers.min_price" class="text-center">{{ part.min_price }}</td>
      <td v-if="headers.min_order" class="text-center">{{ part.min_order }}</td>
      <td v-if="headers.med_cost" class="text-center">{{ part.med_cost }}</td>
      <td v-if="headers.med_price" class="text-center">{{ part.med_price }}</td>
      <td v-if="headers.med_order" class="text-center">{{ part.med_order }}</td>
      <td v-if="headers.max_cost" class="text-center">{{ part.max_cost }}</td>
      <td v-if="headers.max_price" class="text-center">{{ part.max_price }}</td>
      <td v-if="headers.max_order" class="text-center">{{ part.max_order }}</td>
      <td v-if="headers.lead_time">{{ part.lead_time }}</td>
      <td v-if="headers.quote_type">{{ part.quote_type }}</td>
      <td v-if="headers.tag">{{ part.tag }}</td>
    </tr>
  </tbody>
</template>

<script lang="ts" setup>
  import Part from "~/types/store/part";

  import { PhClipboardText } from "@phosphor-icons/vue";

  import type { VisibleHeaders } from "~components/admin/types";

  const props = defineProps<{
    part: Part,
    headers: VisibleHeaders,
  }>();

  async function copy() {
    const keys = Object.keys(props.part) as Array<keyof Part>;

    const text = keys.map((part) => {
      return props.part[part];
    }).join("\n");

    try {
      await navigator.clipboard.writeText(text);

      return Promise.resolve(true);
    } catch (err) {
      console.error(err);

      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject(false);
    }
  }
</script>

<style scoped>
td {
  @apply break-words text-sm;
}
</style>
