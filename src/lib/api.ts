import { z } from "zod";

export type ApiErrorKind =
  | "unauthorized"
  | "forbidden"
  | "validation"
  | "network"
  | "unexpected"
  | "configuration";

export type ApiErrorDetails = {
  status: number | null;
  kind: ApiErrorKind;
  message: string;
  fieldErrors: Record<string, string[]>;
};

export class ApiError extends Error {
  readonly details: ApiErrorDetails;

  constructor(details: ApiErrorDetails) {
    super(details.message);
    this.name = "ApiError";
    this.details = details;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  requiresAuth?: boolean;
  skipRefresh?: boolean;
};

type AuthClientHandlers = {
  getAccessToken: () => string | null;
  refreshAccessToken: () => Promise<boolean>;
  onRefreshFailure: () => void;
};

type ApiErrorPayload = {
  error?: unknown;
  errors?: unknown;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
let authHandlers: AuthClientHandlers | null = null;
let refreshPromise: Promise<boolean> | null = null;

export const configureApiAuth = (handlers: AuthClientHandlers): void => {
  authHandlers = handlers;
};

const createError = (
  kind: ApiErrorKind,
  message: string,
  status: number | null = null,
  fieldErrors: Record<string, string[]> = {},
): ApiError => new ApiError({ kind, message, status, fieldErrors });

const getErrorMessage = (payload: ApiErrorPayload): string => {
  if (typeof payload.error === "string") {
    return payload.error;
  }

  if (Array.isArray(payload.errors)) {
    return payload.errors.filter((error): error is string => typeof error === "string").join(" ");
  }

  return "The request could not be completed.";
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const parseErrorPayload = (value: unknown): ApiErrorPayload => {
  if (!isRecord(value)) {
    return {};
  }

  return { error: value.error, errors: value.errors };
};

const getErrorKind = (status: number): ApiErrorKind => {
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
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
      getErrorMessage(parsedPayload),
      response.status,
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
