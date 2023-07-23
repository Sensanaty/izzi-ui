<template class="flex flex-row">
  <tbody>
    <tr>
      <td class="cursor-pointer active:text-green-600 transition-colors" @click="copy">
        <ph-clipboard-text class="mx-auto" :size="15" weight="fill" />
      </td>
      <td class="px-1">{{ part.part_number }}</td>
      <td>{{ part.company_name }}</td>
      <td class="text-center">{{ part.added }}</td>
      <td class="px-1">{{ part.description }}</td>
      <td class="text-center">{{ part.available }}</td>
      <td class="text-center">{{ part.reserved }}</td>
      <td class="text-center">{{ part.sold }}</td>
      <td class="text-center">{{ part.condition }}</td>
      <td class="text-center">{{ part.min_cost }}</td>
      <td class="text-center">{{ part.min_price }}</td>
      <td class="text-center">{{ part.min_order }}</td>
      <td class="text-center">{{ part.med_cost }}</td>
      <td class="text-center">{{ part.med_price }}</td>
      <td class="text-center">{{ part.med_order }}</td>
      <td class="text-center">{{ part.max_cost }}</td>
      <td class="text-center">{{ part.max_price }}</td>
      <td class="text-center">{{ part.max_order }}</td>
      <td>{{ part.lead_time }}</td>
      <td>{{ part.quote_type }}</td>
      <td>{{ part.tag }}</td>
    </tr>
  </tbody>
</template>

<script lang="ts" setup>
  import Part from "~/types/store/part";

  import { PhClipboardText } from "@phosphor-icons/vue";

  const props = defineProps<{
    part: Part,
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
