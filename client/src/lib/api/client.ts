import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";
export const AUTH_TOKEN_KEY = "flowtask_auth_token";
const API_RETRY_MAX_ATTEMPTS = Number(process.env.NEXT_PUBLIC_API_RETRY_MAX_ATTEMPTS ?? "2");
const API_RETRY_BASE_DELAY_MS = Number(process.env.NEXT_PUBLIC_API_RETRY_BASE_DELAY_MS ?? "350");

type RetryableRequestConfig = {
  __retryCount?: number;
  __retryable?: boolean;
};

export const apiClient = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { "Content-Type": "application/json" },
});

const RETRYABLE_METHODS = new Set(["get", "head", "options", "put", "delete"]);

const isNetworkOrTransientError = (status?: number) => {
  if (!status) return true;
  return status === 408 || status === 429 || status >= 500;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setStoredToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined" && navigator.onLine === false) {
    return Promise.reject(new axios.AxiosError("You appear to be offline", "ERR_NETWORK", config));
  }

  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const retryConfig = config as typeof config & RetryableRequestConfig;
  const method = config.method?.toLowerCase();
  const explicitlyRetryable = retryConfig.__retryable === true;
  retryConfig.__retryable = explicitlyRetryable || Boolean(method && RETRYABLE_METHODS.has(method));

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error) || !error.config) {
      return Promise.reject(error);
    }

    const config = error.config as typeof error.config & RetryableRequestConfig;
    const retryCount = config.__retryCount ?? 0;
    const shouldRetry =
      config.__retryable === true &&
      retryCount < API_RETRY_MAX_ATTEMPTS &&
      isNetworkOrTransientError(error.response?.status) &&
      error.code !== "ERR_CANCELED";

    if (!shouldRetry) {
      return Promise.reject(error);
    }

    config.__retryCount = retryCount + 1;
    const jitter = Math.floor(Math.random() * 120);
    const delay = API_RETRY_BASE_DELAY_MS * 2 ** retryCount + jitter;
    await sleep(delay);
    return apiClient(config);
  },
);
