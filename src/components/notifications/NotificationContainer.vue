<template>
  <Teleport to="body">
    <div class="z-10 font-mono inline-flex column flex-wrap fixed bottom bottom-[20px] right-[15px] max-w-[350px]">
      <PopUp
        v-for="(notification, index) in notifications.notifications"
        :key="notification.id"
        :index="index"
        :type="notification.type"
        :message="notification.message"
        :auto-hide="notification.autoHide"
        :duration="notification.duration"
        @destroy-notification="destroy"
      />
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
  import useNotificationStore from "~/store/notification.js";
  import PopUp from "~components/notifications/PopUp.vue";

  const notifications = useNotificationStore();

  const destroy = (index: number) => { notifications.destroyNotification(index); };
</script>
