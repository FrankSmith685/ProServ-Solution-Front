/* eslint-disable @typescript-eslint/no-explicit-any */
import { callLogoutFunction } from "@/helpers/logoutHelper";
import axios, { AxiosError, type AxiosInstance } from "axios";

const baseURL: string = import.meta.env.VITE_API_URL;
const imageUrl: string = import.meta.env.VITE_IMAGE_URL;

export const imageBaseUrl = imageUrl;

export const api: AxiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export const apiWithAuth: AxiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// 🔐 Adjuntar token en cada request
apiWithAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 Refresh Token automático
apiWithAuth.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        callLogoutFunction();
        return Promise.reject(error);
      }

      try {
        const res = await api.post("/auth/refresh-token", { refreshToken });

        if (!res.data?.success) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          callLogoutFunction();
          return Promise.reject(error);
        }

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiWithAuth(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        callLogoutFunction();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
