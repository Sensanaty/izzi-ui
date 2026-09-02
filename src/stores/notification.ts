import { ref } from "vue";
import { defineStore } from "pinia";

export type Notification = {
  readonly id: string;
  text: string;
  kind: "w" | "d" | "i" | "s";
  autoHide: boolean;
};

type NotificationOptions = Partial<Pick<Notification, "kind" | "autoHide">>;

export const useNotificationStore = defineStore("notification", () => {
  const notifications = ref<Notification[]>([]);

  function createNotification(text: string, options?: NotificationOptions): void {
    if (notifications.value.length >= 4) {
      const oldestNotification = notifications.value[0];

      if (oldestNotification) {
        removeNotification(oldestNotification.id);
      }
    }

    notifications.value.push({
      id: crypto.randomUUID(),
      text,
      kind: options?.kind ?? "s",
      autoHide: options?.autoHide ?? true,
    });
  }

  function removeNotification(notificationId: Notification["id"]): void {
    const index = notifications.value.findIndex(({ id }) => id === notificationId);

    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  }

  function clearNotifications(): void {
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
