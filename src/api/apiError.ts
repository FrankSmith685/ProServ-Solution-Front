/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiErrorResponse } from "@/interfaces/api/api";
import axios, { AxiosError } from "axios";

export const handleApiError = (error: unknown): ApiErrorResponse => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;

    const message =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      "Ocurrió un error inesperado.";

    return {
      success: false,
      message,
      errors: axiosError.response?.data?.errors ?? undefined,
    };
  }

  return {
    success: false,
    message: "Error desconocido. Intente nuevamente.",
  };
};
