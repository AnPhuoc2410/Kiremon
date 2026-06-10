import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getMemoryToken, setMemoryToken } from "./tokenHolder";

const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_API_BASE_URL || "/api";

interface QueueEntry {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueueEntry[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((entry) =>
    error ? entry.reject(error) : entry.resolve(token!),
  );
  failedQueue = [];
};

const REFRESH_BYPASS_URLS = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/confirm-email",
  "/auth/resend-confirmation",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/external-login",
  "/auth/login-2fa",
  "/auth/refresh",
]);

const shouldBypassRefresh = (url?: string): boolean => {
  if (!url) return false;
  const cleanUrl = url.replace(/\?.*$/, "");
  return Array.from(REFRESH_BYPASS_URLS).some(
    (bypassUrl) => cleanUrl === bypassUrl || cleanUrl.endsWith(bypassUrl),
  );
};

/**
 * Create an authenticated axios instance with auto-injected Bearer token.
 * Use this for all API calls that require authentication.
 */
const createAuthenticatedClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  // Attach Bearer token to every outgoing request
  client.interceptors.request.use((config) => {
    const token = getMemoryToken();
    if (token) config.headers.set("Authorization", `Bearer ${token}`);
    return config;
  });

  // Handle 401 — attempt silent refresh then retry original request
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (shouldBypassRefresh(originalRequest.url)) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        // Queue subsequent 401s until the in-flight refresh resolves
        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.set("Authorization", `Bearer ${token}`);
            return client(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            {},
            { withCredentials: true },
          );

          const newToken: string = response.data.token;
          setMemoryToken(newToken);
          processQueue(null, newToken);

          originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          window.dispatchEvent(new CustomEvent("unauthorized-logout"));
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      if (error.code === "ECONNABORTED") console.error("Request timeout");
      else if (!error.response) console.error("Network error");

      return Promise.reject(error);
    },
  );

  return client;
};
/**
 * Base class for authenticated API services.
 * Extend this for services that require authentication (User, Collection, etc.)
 */
export class AuthenticatedApiService {
  protected client: AxiosInstance;

  constructor() {
    this.client = createAuthenticatedClient();
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  protected async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(
      url,
      data,
      config,
    );
    return response.data;
  }

  protected async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  protected async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  protected isAuthenticated(): boolean {
    return !!getMemoryToken();
  }
}

export default createAuthenticatedClient;
