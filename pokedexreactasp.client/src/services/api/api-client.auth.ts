import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getMemoryToken, setMemoryToken } from "./tokenHolder";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Create an authenticated axios instance with auto-injected Bearer token
 * Use this for all API calls that require authentication
 */
const createAuthenticatedClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use(
    (config) => {
      const token = getMemoryToken();
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Avoid infinite loop if refresh request itself returns 401
      if (originalRequest.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.set("Authorization", `Bearer ${token}`);
              return client(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
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

          const newAccessToken = response.data.token;
          setMemoryToken(newAccessToken);

          processQueue(null, newAccessToken);

          originalRequest.headers.set(
            "Authorization",
            `Bearer ${newAccessToken}`,
          );
          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          // Trigger logout custom event to let AuthContext clear state
          window.dispatchEvent(new CustomEvent("unauthorized-logout"));
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      if (error.code === "ECONNABORTED") {
        console.error("Request timeout");
      } else if (!error.response) {
        console.error("Network error");
      }

      return Promise.reject(error);
    },
  );

  return client;
};

/**
 * Base class for authenticated API services
 * Extends this class for services that need authentication (User, Collection, etc.)
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
    data?: any,
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
    data?: any,
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

  /**
   * Check if user is authenticated
   */
  protected isAuthenticated(): boolean {
    return !!getMemoryToken();
  }
}

export default createAuthenticatedClient;
