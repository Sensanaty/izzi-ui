import { z } from "zod";
import { apiErrorResponseSchema } from "@/lib/schemas/api";

export type { ApiErrorResponse } from "@/lib/schemas/api";

export type ApiErrorKind =
  | "bad_request"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "validation"
  | "network"
  | "unexpected"
  | "configuration";

export type ApiErrorDetails = {
  status: number | null;
  kind: ApiErrorKind;
  code: string | null;
  message: string;
  fieldErrors: Record<string, string[]>;
  details: Record<string, unknown>;
};

export class ApiError extends Error {
  readonly details: ApiErrorDetails;

  constructor(details: ApiErrorDetails) {
    super(details.message);
    this.name = "ApiError";
    this.details = details;
  }
}

export function getApiErrorDetails(
  exception: unknown,
  fallbackMessage = "An unexpected API error occurred.",
): ApiErrorDetails {
  if (exception instanceof ApiError) {
    return exception.details;
  }

  return {
    kind: "unexpected",
    status: null,
    code: null,
    message: fallbackMessage,
    fieldErrors: {},
    details: {},
  };
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  requiresAuth?: boolean;
  skipRefresh?: boolean;
};

type AuthClientHandlers = {
  getAccessToken: () => string | null;
  initializeAuth: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  onRefreshFailure: () => void;
};

type ParsedApiErrorPayload = {
  code: string | null;
  message: string;
  details: Record<string, unknown>;
  fieldErrors: Record<string, string[]>;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
let authHandlers: AuthClientHandlers | null = null;
let refreshPromise: Promise<boolean> | null = null;

export const configureApiAuth = (handlers: AuthClientHandlers): void => {
  authHandlers = handlers;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isStringArrayRecord = (value: unknown): value is Record<string, string[]> => {
  if (!isRecord(value)) return false;

  return Object.values(value).every(
    (messages) => Array.isArray(messages) && messages.every((message) => typeof message === "string"),
  );
};

const parseErrorPayload = (value: unknown): ParsedApiErrorPayload => {
  const result = apiErrorResponseSchema.safeParse(value);

  if (!result.success) {
    return { code: null, message: "The request could not be completed.", details: {}, fieldErrors: {} };
  }

  const { code, message, details } = result.data.error;
  const fieldErrors = isStringArrayRecord(details.fields) ? details.fields : {};

  return { code, message, details, fieldErrors };
};

const createError = (
  kind: ApiErrorKind,
  message: string,
  status: number | null = null,
  code: string | null = null,
  details: Record<string, unknown> = {},
  fieldErrors: Record<string, string[]> = {},
): ApiError => new ApiError({ kind, status, code, message, details, fieldErrors });

const getErrorKind = (status: number): ApiErrorKind => {
  if (status === 400) return "bad_request";
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status === 409) return "conflict";
  if (status === 422) return "validation";

  return "unexpected";
};

async function requestJson<TParsedResponse>(
  path: string,
  options: RequestOptions,
  schema: z.ZodType<TParsedResponse>,
  hasRetried: boolean,
): Promise<TParsedResponse> {
  if (!apiBaseUrl) {
    throw createError("configuration", "The API base URL is not configured.");
  }

  const headers = new Headers({ Accept: "application/json" });

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (options.requiresAuth !== false && !options.skipRefresh && authHandlers) {
    await authHandlers.initializeAuth();
  }

  const accessToken = authHandlers?.getAccessToken();

  if (options.requiresAuth !== false && accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      credentials: "include",
    });
  } catch {
    throw createError("network", "Unable to reach the server.");
  }

  if (response.status === 401 && !hasRetried && !options.skipRefresh && authHandlers) {
    refreshPromise ??= authHandlers.refreshAccessToken().finally(() => {
      refreshPromise = null;
    });

    const refreshed = await refreshPromise;

    if (refreshed) {
      return requestJson(path, options, schema, true);
    }

    authHandlers.onRefreshFailure();
  }

  if (!response.ok) {
    let payload: unknown = {};

    try {
      payload = await response.json();
    } catch {
      payload = {};
    }

    const parsedPayload = parseErrorPayload(payload);
    throw createError(
      getErrorKind(response.status),
      parsedPayload.message,
      response.status,
      parsedPayload.code,
      parsedPayload.details,
      parsedPayload.fieldErrors,
    );
  }

  let payload: unknown;

  if (response.status === 204) {
    payload = undefined;
  } else {
    try {
      payload = await response.json();
    } catch {
      throw createError("unexpected", "The server returned an invalid response.", response.status);
    }
  }

  const result = schema.safeParse(payload);

  if (!result.success) {
    throw createError("unexpected", "The server returned an invalid response.", response.status);
  }

  return result.data;
}

export const api = {
  get: <TParsedResponse>(
    path: string,
    schema: z.ZodType<TParsedResponse>,
    options: Omit<RequestOptions, "method" | "body"> = {},
  ) => requestJson(path, { ...options, method: "GET" }, schema, false),
  post: <TParsedResponse>(
    path: string,
    body: unknown,
    schema: z.ZodType<TParsedResponse>,
    options: Omit<RequestOptions, "method" | "body"> = {},
  ) => requestJson(path, { ...options, method: "POST", body }, schema, false),
};
