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
      duration: Notification["duration"] = 1500,
      autoHide: Notification["autoHide"] = true
    ) {
      if (this.notifications.length > 9) { this.destroyNotification(0); }

      const notification: Notification = {
        id: crypto.randomUUID(),
        message: message,
        type: type,
        duration: duration,
        autoHide: autoHide
      };

      this.notifications.push(notification);
    },

    destroyNotification(index: number) {
      this.notifications.splice(index, 1);
    },

    clearAll() { this.$reset(); }
  }
});

export default useNotificationStore;
