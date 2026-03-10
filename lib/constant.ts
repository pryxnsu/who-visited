export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const DASHBOARD_POLL_INTERVAL_STORAGE_KEY = 'dashboard:pollIntervalMs';
export const DASHBOARD_POLL_INTERVAL_OPTIONS = [5000, 8000, 15000, 30000] as const;
export const DEFAULT_DASHBOARD_POLL_INTERVAL_MS = 8000;

export type DashboardPollIntervalMs = (typeof DASHBOARD_POLL_INTERVAL_OPTIONS)[number];

export function isValidDashboardPollInterval(value: number): value is DashboardPollIntervalMs {
  return DASHBOARD_POLL_INTERVAL_OPTIONS.includes(value as DashboardPollIntervalMs);
}

export const CONTACT_EMAIL = 'priyanshuknp444@gmail.com';