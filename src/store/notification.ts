import { defineStore } from "pinia";
import Notification from "~/types/store/notification";

const useNotificationStore = defineStore("notification", {
  state: () => {
    return { notifications: [] as Notification[] };
  },

  actions: {
    createNotification(
      message: Notification["message"],
      type: Notification["type"],
      duration: Notification["duration"] = 2000,
      autoHide: Notification["autoHide"] = true
    ) {
      if (!message) { return; }

      if (this.notifications.length > 9) { this.destroyNotification(0) }

      const notification: Notification = {
        id: this.assignId(),
        message: message,
        type: type || "info",
        duration: duration,
        autoHide: autoHide
      };

      this.notifications.push(notification);
    },

    destroyNotification(index: number) {
      this.notifications.splice(index, 1);
    },

    assignId(): number {
      const lastNotificationId = this.notifications[this.notifications.length - 1]?.id || 0;

      return lastNotificationId + 1;
    },

    clearAll() { this.$reset(); }
  }
});

export default useNotificationStore;
