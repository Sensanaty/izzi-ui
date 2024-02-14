<template class="flex flex-row">
  <tbody ref="row" class="focus:bg-stone-800">
    <tr class="hover:bg-stone-800 focus:bg-stone-800">
      <td>
        <div class="flex flex-col items-center">
          <ph-pencil class="icon mb-2" :size="15" weight="duotone" @click="editPart" />
          <ph-clipboard-text class="icon mb-2" :size="15" weight="duotone" @click="copy" />
          <ph-quotes class="icon" :size="15" weigth="duotone" @click="copyQuote" />
        </div>
      </td>
      <td class="px-1 font-mono">{{ part.part_number }}</td>
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
  import { PhClipboardText, PhPencil, PhQuotes } from "@phosphor-icons/vue";
  import { Fn, useEventListener } from "@vueuse/core";
  import { onBeforeUnmount, ref } from "vue";
  import { useRouter } from "vue-router";

  import useNotificationStore from "~/store/notification";
  import type Part from "~/types/store/part";
  import { titleize } from "~/utils/stringUtils";

  const props = defineProps<{
    part: Part,
  }>();

  const notifications = useNotificationStore();

  const router = useRouter();

  function editPart() {
    router.push({ path: `/admin/${props.part.id}/edit` });
  }

  async function copy() {
    const keys = Object.keys(props.part) as Array<keyof Part>;

    const text = keys.flatMap((part) => {
      if (
        part === "id" ||
        part === "company_id" ||
        part  === "created_at" ||
        part === "updated_at"
      ) {
        return [];
      }

      if (!props.part[part] || props.part[part] === "") {
        return `${part}: N/A`;
      } else {
        return `${part}: ${props.part[part]}`;
      }
    }).join("\n");

    try {
      await navigator.clipboard.writeText(text);

      return Promise.resolve(true).then(() => {
        notifications.createNotification(`Part ${props.part.part_number} copied to clipboard`, "succ");
      });
    } catch (err: unknown) {
      console.error(err);

      notifications.createNotification("Failed to copy part details, please try again", "dang");

      return Promise.reject(err);
    }
  }

  async function copyQuote() {
    const keys = ["part_number", "description", "available", "condition", "min_cost", "min_order", "med_cost", "med_order", "max_cost", "max_order", "lead_time", "quote_type", "tag"] as Array<keyof Part>;

    const text = keys.map((key) => {
      if (/.*cost/.test(key)) {
        return `${titleize(key)}: ${props.part[key]} | `;
      } else {
        return `${titleize(key)}: ${props.part[key]}\n`;
      }
    }).join("");

    try {
      await navigator.clipboard.writeText(text);

      return Promise.resolve(true).then(() => {
        notifications.createNotification(`Quote Details for ${props.part.part_number} copied`, "succ");
      });
    } catch (err: unknown) {
      console.error(err);

      notifications.createNotification("Failed to copy part details, please try again", "dang");

      return Promise.reject(err);
    }
  }

  const row = ref<HTMLElement | null>(null);
  /**
   * To prevent events from firing when the row isn't focused, we have to call the method to unsubscribe the event listener.
   * The scope of the inner method inside the onFocus() function won't allow us to define an event listener inside of it
   * while calling the unsubscription from the onUnfocus() function, we have to give it a temporary null value and assign it
   * from within onFocus.
  */
  let onKeypress: Fn | null = null;

  const onFocus = useEventListener(row, "focusin", () => {
    onKeypress = useEventListener("keyup", (e: KeyboardEvent) => {
      switch (e.key) {
      case "c":
        copy();
        break;
      case "q":
        copyQuote();
        break;
      case "e":
        editPart();
        break;
      default:
        return;
      }
    });
  });

  const onUnfocus = useEventListener(row, "focusout", () => {
    if (onKeypress !== null) { onKeypress(); }
    onFocus();
  });

  onBeforeUnmount(() => {
    onFocus();
    onUnfocus();
  });
</script>

<style scoped>
td {
  @apply break-words text-xs py-1;
}

.icon {
  @apply mx-auto cursor-pointer hover:text-green-500 active:text-green-600 mb-2;
}
</style>
