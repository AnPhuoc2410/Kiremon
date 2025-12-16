import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getCookie } from "../../components/utils/cookieUtils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

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
      const token = getCookie("accessToken");
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.error("Unauthorized - token may be expired");
      } else if (error.code === "ECONNABORTED") {
        console.error("Request timeout");
      } else if (!error.response) {
        console.error("Network error");
      }
      return Promise.reject(error);
    }
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
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  protected async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  /**
   * Check if user is authenticated
   */
  protected isAuthenticated(): boolean {
    return !!getCookie("accessToken");
  }
}

export default createAuthenticatedClient;
