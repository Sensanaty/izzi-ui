import { defineStore } from "pinia";
import { Notification, NotificationType } from "#types";

const useNotificationStore = defineStore("notification", {
  state: () => { return { notifications: [] as Notification[] }; },
  actions: {
    createNotification(message: Notification["message"], type: NotificationType = NotificationType.info, autoHide: Notification["autoHide"] = false, duration: Notification["duration"] = 1500) {
      if (this.notifications.length >= 9) {
        this.destroyNotification(0);
      }

      const notification: Notification = {
        id: this.assignId(this.notifications),
        type: type,
        message: message,
        autoHide: autoHide,
        duration: duration || 1500
      };

      this.notifications.push(notification);
    },
    destroyNotification(index: number) {
      this.notifications.splice(index, 1);
    },
    clearAll() { this.notifications = []; },
    assignId(notifications: Array<Notification>): number {
      if (!notifications || notifications.length === 0) { return 0; }

      const length = notifications.length;
      const lastId = notifications[length - 1].id;

      return lastId + 1;
    }
  }
});

export default useNotificationStore;
