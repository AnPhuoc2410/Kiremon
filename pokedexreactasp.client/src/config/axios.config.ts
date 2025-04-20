import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getCookie } from "../components/utils/cookieUtils";

const api = axios.create({
  baseURL: "https://localhost:7051",
  withCredentials: false,
});

const handleBefore = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const token = getCookie("accessToken");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
};

const handleError = (error: AxiosError): Promise<AxiosError> => {
  console.log(error);
  return Promise.reject(error);
};

api.interceptors.request.use(handleBefore, handleError);

export default api;
