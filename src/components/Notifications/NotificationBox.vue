<template>
  <button
    type="button"
    class="z-20 mb-3 w-full cursor-pointer rounded border-2 bg-neutral-900 px-3 py-2 text-start font-mono text-sm font-semibold last:mb-0 hover:bg-neutral-900/50 active:bg-neutral-950"
    :class="[notification.kind]"
    @click.prevent="removeNotification(notification.id)"
  >
    {{ notification.text }}
  </button>
</template>

<script setup lang="ts">
import useNotificationStore, { type Notification } from "@/stores/notification";
import { onMounted } from "vue";

const props = defineProps<{ notification: Notification }>();

const { removeNotification } = useNotificationStore();

onMounted(() => {
  if (props.notification.autoHide) {
    setTimeout(() => removeNotification(props.notification.id), 5000);
  }
});
</script>

<style scoped lang="postcss">
.w { @apply border-amber-500; }
.d { @apply border-red-500; }
.i { @apply border-teal-500; }
.s { @apply border-emerald-500; }
</style>
