import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { env } from "./env";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type RetriableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = Cookies.get(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableRequest | undefined;

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);

      if (!refreshToken) {
        Cookies.remove(ACCESS_TOKEN_KEY);
        Cookies.remove(REFRESH_TOKEN_KEY);
        return Promise.reject(toApiError(error));
      }

      try {
        const { data } = await axios.post<{ accessToken: string; refreshToken?: string }>(
          `${env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken },
        );
        Cookies.set(ACCESS_TOKEN_KEY, data.accessToken, { sameSite: "lax", expires: 7 });
        if (data.refreshToken) {
          Cookies.set(REFRESH_TOKEN_KEY, data.refreshToken, { sameSite: "lax", expires: 30 });
        }
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(original);
      } catch (refreshError) {
        Cookies.remove(ACCESS_TOKEN_KEY);
        Cookies.remove(REFRESH_TOKEN_KEY);
        return Promise.reject(toApiError(refreshError as AxiosError));
      }
    }

    return Promise.reject(toApiError(error));
  },
);

function toApiError(error: AxiosError): ApiError {
  const status = error.response?.status ?? 0;
  const data = error.response?.data;
  const message =
    (typeof data === "object" && data && "message" in data && typeof data.message === "string"
      ? data.message
      : error.message) || "Request failed";
  return new ApiError(message, status, data);
}

export const tokenStorage = {
  setAccess: (token: string) =>
    Cookies.set(ACCESS_TOKEN_KEY, token, { sameSite: "lax", expires: 7 }),
  setRefresh: (token: string) =>
    Cookies.set(REFRESH_TOKEN_KEY, token, { sameSite: "lax", expires: 30 }),
  getAccess: () => Cookies.get(ACCESS_TOKEN_KEY),
  getRefresh: () => Cookies.get(REFRESH_TOKEN_KEY),
  clear: () => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
  },
};
