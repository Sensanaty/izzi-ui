import { defineStore } from "pinia";
import { ref } from "vue";

export type Notification = {
  readonly id: string;
  text: string;
  kind: "w" | "d" | "i" | "s";
  autoHide: boolean;
};

type NotificationOptions = Partial<{
  kind: Notification["kind"];
  autoHide: Notification["autoHide"];
}>;

const useNotificationStore = defineStore("notification", () => {
  const notifications = ref<Notification[]>([]);

  function createNotification(text: Notification["text"], options?: NotificationOptions) {
    if (notifications.value.length >= 4) {
      removeNotification(notifications.value[0].id);
    }

    notifications.value.push({
      id: crypto.randomUUID(),
      text,
      kind: options?.kind ?? "s",
      autoHide: options?.autoHide ?? true,
    });
  };

  function removeNotification(notificationId: Notification["id"]) {
    const index = notifications.value.findIndex(({ id }) => id === notificationId);

    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  }

  function clearNotifications() {
    notifications.value = [];
  }

  return {
    notifications,

    createNotification,
    removeNotification,
    clearNotifications,
  };
});

export default useNotificationStore;
