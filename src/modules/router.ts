import { UserModule } from "~/types";
import useAuthStore from "#store/auth";
import useNotificationStore from "#store/notification";
import { NotificationType } from "#types";

export const install: UserModule = ({ router }) => {
  const auth = useAuthStore();
  const notifications = useNotificationStore();

  router.beforeEach((to) => {
    if (to.meta.admin && !auth.checkToken()) {
      notifications.createNotification(
        "You have to be logged in to view that page",
        NotificationType.warn,
        2000
      );

      return "/login";
    }
  });
};
