<template class="flex flex-row">
  <tbody>
    <tr>
      <td>
        <div class="flex flex-col items-center">
          <ph-clipboard-text class="mx-auto cursor-pointer hover:text-green-500 active:text-green-600 mb-2" :size="15" weight="duotone" @click="copy" />
          <ph-pencil class="mx-auto cursor-pointer hover:text-green-500 active:text-green-600" :size="15" weight="duotone" />
        </div>
      </td>
      <td class="px-1">{{ part.part_number }}</td>
      <td>{{ part.company_name }}</td>
      <td class="text-center !text-xs font-mono">{{ part.added }}</td>
      <td class="px-1">{{ part.description }}</td>
      <td class="text-center font-mono">{{ part.available }}</td>
      <td class="text-center font-mono">{{ part.reserved }}</td>
      <td class="text-center font-mono">{{ part.sold }}</td>
      <td class="text-center font-mono">{{ part.condition }}</td>
      <td class="text-center font-mono">{{ part.min_cost }}</td>
      <td class="text-center font-mono">{{ part.min_price }}</td>
      <td class="text-center font-mono">{{ part.min_order }}</td>
      <td class="text-center font-mono">{{ part.med_cost }}</td>
      <td class="text-center font-mono">{{ part.med_price }}</td>
      <td class="text-center font-mono">{{ part.med_order }}</td>
      <td class="text-center font-mono">{{ part.max_cost }}</td>
      <td class="text-center font-mono">{{ part.max_price }}</td>
      <td class="text-center font-mono">{{ part.max_order }}</td>
      <td>{{ part.lead_time }}</td>
      <td>{{ part.quote_type }}</td>
      <td>{{ part.tag }}</td>
    </tr>
  </tbody>
</template>

<script lang="ts" setup>
  import useNotificationStore from "~/store/notification";

  import { PhClipboardText, PhPencil } from "@phosphor-icons/vue";

  import type Part from "~/types/store/part";

  const props = defineProps<{
    part: Part,
  }>();

  const notifications = useNotificationStore();

  async function copy() {
    const keys = Object.keys(props.part) as Array<keyof Part>;

    const text = keys.map((part) => {
      return props.part[part];
    }).join("\n");

    try {
      await navigator.clipboard.writeText(text);

      return Promise.resolve(true).then(() => {
        notifications.createNotification(`Part ${props.part.part_number} copied to clipboard`, "succ");
      });
    } catch (err) {
      console.error(err);

      notifications.createNotification("Failed to copy part details, please try again", "dang");

      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject(false);
    }
  }
</script>

<style scoped>
td {
  @apply break-words text-xs py-1;
}
</style>
