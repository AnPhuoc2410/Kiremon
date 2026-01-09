import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Create a base axios instance with common configuration
const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 15000, // 15 seconds timeout
    withCredentials: false,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor for handling common request operations
  client.interceptors.request.use(
    (config) => {
      // You can add auth tokens or other request modifications here
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Response interceptor for handling common response operations
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Handle common errors (network errors, timeouts, etc.)
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

// Base class for API services
export class ApiService {
  protected client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = createApiClient(baseURL);
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
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
}

export default createApiClient;
