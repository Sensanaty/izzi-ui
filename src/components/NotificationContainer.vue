<template>
  <Teleport to="body">
    <div class="popup">
      <Transition name="fade" mode="out-in">
        <div v-if="notifications.notifications.length > 2" class="clear">
          <button @click="notifications.clearAll()">Clear All</button>
        </div>
      </Transition>

      <TransitionGroup name="fade" mode="out-in">
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

  .clear { align-self: flex-end }

  .clear > button {
    text-align: right;
    background: black;
    color: white;
    padding: 10px 15px;
    border-radius: 8px;
    border: 2px solid var(--information-color);
    transition: color 110ms ease-in-out;

    &:hover { color: var(--accent) }
  }

  .fade-move, .fade-enter-active, .fade-leave-active { transition: all 100ms ease-in-out }
  .fade-enter-from, .fade-leave-to { opacity: 0 }

  .fade-leave-active { position: absolute }
</style>
