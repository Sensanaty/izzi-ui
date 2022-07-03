<template>
  <Teleport to="body">
    <div class="popup">
      <TransitionGroup name="slide" mode="out-in">
        <PopUp
          v-for="(notification, index) in notifications.notifications"
          :key="notification.id"
          :index="index"
          :type="notification.type"
          :message="notification.message"
          :auto-hide="notification.autoHide"
          :duration="notification.duration"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
  import useNotificationStore from "#store/notification";

  const notifications = useNotificationStore();
</script>

<style lang="scss" scoped>
  .popup {
    font-family: "MonoLisa", monospace;
    display: inline-flex;
    flex-flow: column wrap;
    position: fixed;
    bottom: 15px;
    right: 10px;
    min-width: 300px;
    flex: 0 1;
  }

  .slide-enter-active, .slide-leave-active { transition: all 100ms ease-in-out }
  .slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
