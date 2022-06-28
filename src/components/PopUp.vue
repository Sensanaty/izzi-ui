<template>
  <div :class="[type]" @click.prevent="notifications.destroyNotification(index)">
    <p>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from "vue";
  import useNotificationStore from "#store/notification";
  import { NotificationType } from "#types";

  const notifications = useNotificationStore();

  const props = defineProps<{
    index: number,
    type: NotificationType,
    message: string,
    autoHide: boolean,
    duration: number
  }>();

  onMounted(() => {
    if (!props.autoHide) { return; }

    setTimeout(() => { notifications.destroyNotification(props.index); }, props.duration);
  });
</script>

<style lang="scss" scoped>
  div {
    min-width: 300px;
    font-size: 0.95rem;
    border-radius: 5px;
    margin: 15px 0 0 0;
    padding: 15px 25px;
    background: black;
    color: white;
    z-index: 99;
    cursor: pointer;
    border: 3px solid transparent;
    transition: background 110ms ease-in-out;

    &:hover { background: var(--background-accent) }
  }

  .warning { border-color: var(--warning-color) }
  .information { border-color: var(--information-color) }
  .success { border-color: var(--success-color) }
  .danger { border-color: var(--danger-color) }
</style>
