import { getApiErrorDetails } from "@/lib/api";
import { useNotificationStore } from "@/stores/notification";

import type { ApiErrorDetails } from "@/lib/api";
import type { Notification } from "@/stores/notification";

type NotificationSeverity = Notification["kind"];
type ApiErrorNotificationDetails = Pick<ApiErrorDetails, "code" | "kind" | "message">;

type NotifyApiErrorOptions = {
  skipAuthenticationErrors?: boolean;
};

const authenticationErrorCodes = new Set([
  "invalid_token",
  "invalid_refresh_token",
  "authentication_required",
]);

function normalizeMessage(message: string): string {
  return message.trimEnd().replace(/[.!?]+$/, "");
}

function getSeverity(details: ApiErrorNotificationDetails): NotificationSeverity {
  switch (details.code) {
    case "invalid_token":
    case "invalid_refresh_token":
    case "authentication_required":
      return "i";
    case "forbidden":
    case "internal_server_error":
      return "d";
    case "invalid_credentials":
    case "not_found":
    case "invalid_parameters":
    case "bad_request":
    case "validation_failed":
    case "invalid_query":
    case "page_out_of_range":
      return "w";
    default:
      return details.kind === "network" ||
        details.kind === "unexpected" ||
        details.kind === "configuration"
        ? "d"
        : "w";
  }
}

export function notifyApiErrorDetails(
  details: ApiErrorNotificationDetails,
  fallbackMessage: string,
  options: NotifyApiErrorOptions = {},
): ApiErrorNotificationDetails {
  const normalizedDetails = {
    ...details,
    message: normalizeMessage(details.message || fallbackMessage),
  };

  if (options.skipAuthenticationErrors && authenticationErrorCodes.has(details.code ?? "")) {
    return normalizedDetails;
  }

  const { createNotification } = useNotificationStore();
  createNotification(normalizedDetails.message, { kind: getSeverity(normalizedDetails) });

  return normalizedDetails;
}

export function notifyApiError(
  exception: unknown,
  fallbackMessage: string,
  options: NotifyApiErrorOptions = {},
): ApiErrorDetails {
  const details = getApiErrorDetails(exception, fallbackMessage);
  notifyApiErrorDetails(details, fallbackMessage, options);

  return {
    ...details,
    message: normalizeMessage(details.message || fallbackMessage),
  };
}
