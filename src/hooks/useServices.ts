import { useState } from "react";
import { api, apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";

import type {
  Service,
  ServiceForm,
  ServiceResponse,
  ServicesResponse,
  UseServices,
} from "@/interfaces/hook/IUseServices";

import type { BasicCallback } from "@/interfaces/helpers/IBasicCallbacks";

import { useMedia } from "./useMedia";
import { useAppState } from "./useAppState";

export const useServices = (): UseServices => {
  const { services, setServices } = useAppState();
  const [loading, setLoading] = useState<boolean>(false);

  const { uploadMedia, deleteMedia } = useMedia();

  /* ================= GET ================= */
  const getServices = async (callback?: BasicCallback): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await api.get<ServicesResponse>("/services");

      if (!data.success) {
        throw new Error(data.message);
      }

      setServices(data.data);

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

  /* ================= GET BY ID ================= */
  const getServiceById = async (
    id: string,
    callback?: (service: Service | null) => void
  ): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await api.get<ServiceResponse>(`/services/${id}`);

      if (!data.success) {
        throw new Error(data.message);
      }

      callback?.(data.data);
    } catch (error) {
      const handled = handleApiError(error);
      console.error("Error obteniendo servicio:", handled.message);
      callback?.(null);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CREATE ================= */
  const createService = async (
    form: ServiceForm,
    file?: File,
    url?: string,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      let media_id = form.media_id;

      if (file) {
        const media = await uploadMedia(file, "service");
        if (!media) throw new Error("Error subiendo imagen");
        media_id = media.id;
      } else if (url) {
        const media = await uploadMedia(url, "service");
        if (!media) throw new Error("Error guardando URL");
        media_id = media.id;
      }

      if (!media_id) {
        throw new Error("La imagen es obligatoria");
      }

      const { data } = await apiWithAuth.post<ServiceResponse>("/services", {
        ...form,
        media_id,
      });

      if (!data.success) {
        throw new Error(data.message);
      }

      setServices([...(services || []), data.data]);

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

  /* ================= UPDATE ================= */
  const updateService = async (
    id: string,
    form: ServiceForm,
    file?: File,
    url?: string,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      let media_id = form.media_id;

      if (file) {
        const media = await uploadMedia(file, "service");
        if (!media) throw new Error("Error subiendo imagen");
        media_id = media.id;
      } else if (url) {
        const media = await uploadMedia(url, "service");
        if (!media) throw new Error("Error guardando URL");
        media_id = media.id;
      }

      const payload = {
        ...form,
        ...(media_id !== undefined ? { media_id } : {}),
      };

      const { data } = await apiWithAuth.put<ServiceResponse>(
        `/services/${id}`,
        payload
      );

      if (!data.success) {
        throw new Error(data.message);
      }

      setServices(
        services.map((service) =>
          service.id === id ? data.data : service
        )
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

  /* ================= DELETE ================= */
  const deleteService = async (
    id: string,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      const current = services.find((service) => service.id === id);

      const { data } = await apiWithAuth.delete<{ success: boolean; message: string }>(
        `/services/${id}`
      );

      if (!data.success) {
        throw new Error(data.message);
      }

      if (current?.media_id) {
        await deleteMedia(current.media_id);
      }

      setServices(services.filter((service) => service.id !== id));

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

  /* ================= TOGGLE ================= */
  const toggleService = async (service: Service): Promise<void> => {
    await updateService(service.id, {
      activo: !service.activo,
    });
  };

  return {
    services,
    loading,
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    toggleService,
  };
};