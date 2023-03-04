import { AxiosError } from "axios";
import useNotificationStore from "~/store/notification";

// Generic function that will handle generic catches caused by exceptions in response attempts
export default function catchResponse(error: unknown) {
  const { createNotification } = useNotificationStore();

  if (error instanceof AxiosError) {
    createNotification(error?.response?.data.error, "dang");
  } else {
    createNotification("Something went wrong, please try again", "warn");
  }
}
