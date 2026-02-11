// import { useCallback } from "react";
import { apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";

import type {
  UseService,
  Servicio,
  CreateServicePayload,
  UpdateServicePayload,
  ToggleArchivePayload,
  ApiResponse,
  ServiciosActivosResponse,
  ServiceCallback,
} from "@/interfaces/hook/IUseService";

export const useService = (): UseService => {
  /* ================== GET ================== */

  const getMisServicios = async (): Promise<Servicio[]> => {
    try {
      const res = await apiWithAuth.get<Servicio[]>("/servicio/mis-servicios");
      return res.data ?? [];
    } catch (error) {
      console.error(handleApiError(error).message);
      return [];
    }
  };

  const getServicioById = async (id: string): Promise<Servicio | null> => {
    try {
      const res = await apiWithAuth.get<ApiResponse<Servicio>>(
        `/servicio/${id}`
      );
      return res.data.data ?? null;
    } catch (error) {
      console.error(handleApiError(error).message);
      return null;
    }
  };

  const getServiciosActivos = async (): Promise<ServiciosActivosResponse | null> => {
    try {
      const res = await apiWithAuth.get<ApiResponse<ServiciosActivosResponse>>(
        "/servicio/activos"
      );
      return res.data.data ?? null;
    } catch (error) {
      console.error(handleApiError(error).message);
      return null;
    }
  };

  const getServiciosPremium = async (): Promise<Servicio[]> => {
    try {
      const res = await apiWithAuth.get<ApiResponse<Servicio[]>>(
        "/servicio/activos/premium"
      );
      return res.data.data ?? [];
    } catch (error) {
      console.error(handleApiError(error).message);
      return [];
    }
  };

  const getServiciosChevere = async (): Promise<Servicio[]> => {
    try {
      const res = await apiWithAuth.get<ApiResponse<Servicio[]>>(
        "/servicio/activos/chevere"
      );
      return res.data.data ?? [];
    } catch (error) {
      console.error(handleApiError(error).message);
      return [];
    }
  };

  /* ================== POST / PUT ================== */

  const createServicio = async (
    payload: CreateServicePayload,
    callback?: ServiceCallback<Servicio>
  ): Promise<void> => {
    try {
      const res = await apiWithAuth.post<ApiResponse<Servicio>>(
        "/servicio",
        payload
      );

      callback?.({
        success: res.data.success,
        message: res.data.message,
        data: res.data.data,
      });
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({ success: false, message: handled.message });
    }
  };

  const updateServicio = async (
    id: string,
    payload: UpdateServicePayload,
    callback?: ServiceCallback<Servicio>
  ): Promise<void> => {
    try {
      const res = await apiWithAuth.put<ApiResponse<Servicio>>(
        `/servicio/${id}`,
        payload
      );

      callback?.({
        success: res.data.success,
        message: res.data.message,
        data: res.data.data,
      });
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({ success: false, message: handled.message });
    }
  };

  const toggleArchiveServicio = async (
    payload: ToggleArchivePayload,
    callback?: ServiceCallback
  ): Promise<void> => {
    try {
      const res = await apiWithAuth.put<ApiResponse<Servicio>>(
        "/servicio/archivar",
        payload
      );

      callback?.({
        success: res.data.success,
        message: res.data.message,
      });
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({ success: false, message: handled.message });
    }
  };

  return {
    getMisServicios,
    getServicioById,
    getServiciosActivos,
    getServiciosPremium,
    getServiciosChevere,
    createServicio,
    updateServicio,
    toggleArchiveServicio,
  };
};
