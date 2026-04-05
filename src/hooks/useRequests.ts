import { useState } from "react";
import { apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";

import type {
  RequestItem,
  RequestResponse,
  RequestsResponse,
  UseRequests,
} from "@/interfaces/hook/IUseRequests";
import type { BasicCallback } from "@/interfaces/helpers/IBasicCallbacks";
import { useAppState } from "./useAppState";

export const useRequests = (): UseRequests => {
  const {requests, setRequests} = useAppState();
  const [loading, setLoading] = useState<boolean>(false);

  const getRequests = async (callback?: BasicCallback): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.get<RequestsResponse>("/requests");

      if (!data.success) {
        throw new Error(data.message);
      }

      setRequests(data.data);

      callback?.({
        success: true,
        message: data.message,
      });
    } catch (error) {
      const handled = handleApiError(error);

      callback?.({
        success: false,
        message: handled.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const getRequestById = async (
    id: string,
    callback?: (request: RequestItem | null) => void
  ): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.get<RequestResponse>(`/requests/${id}`);

      if (!data.success) {
        throw new Error(data.message);
      }

      callback?.(data.data);
    } catch (error) {
      const handled = handleApiError(error);
      console.error("Error obteniendo solicitud:", handled.message);
      callback?.(null);
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (
    form: Partial<RequestItem>,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      const payload = {
        contacto_id: form.contacto_id || "",
        fecha_programada: form.fecha_programada || null,
        estado: form.estado || "pendiente",
      };

      const { data } = await apiWithAuth.post<RequestResponse>("/requests", payload);

      if (!data.success) {
        throw new Error(data.message);
      }

      setRequests([data.data, ...requests]);

      callback?.({
        success: true,
        message: data.message,
      });
    } catch (error) {
      const handled = handleApiError(error);

      callback?.({
        success: false,
        message: handled.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRequest = async (
    id: string,
    form: Partial<RequestItem>,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.put<RequestResponse>(
        `/requests/${id}`,
        form
      );

      if (!data.success) {
        throw new Error(data.message);
      }

      setRequests(
        requests.map((request) => (request.id === id ? data.data : request))
      );

      callback?.({
        success: true,
        message: data.message,
      });
    } catch (error) {
      const handled = handleApiError(error);

      callback?.({
        success: false,
        message: handled.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    requests,
    loading,
    getRequests,
    getRequestById,
    createRequest,
    updateRequest,
  };
};