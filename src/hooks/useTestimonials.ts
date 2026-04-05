import { useState } from "react";
import { api, apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";

import type {
  Testimonial,
  TestimonialForm,
  TestimonialResponse,
  TestimonialsResponse,
  UseTestimonials,
} from "@/interfaces/hook/IUseTestimonials";

import type { BasicCallback } from "@/interfaces/helpers/IBasicCallbacks";

import { useMedia } from "./useMedia";
import { useAppState } from "./useAppState";

export const useTestimonials = (): UseTestimonials => {
  const { testimonials, setTestimonials } = useAppState();
  const [loading, setLoading] = useState<boolean>(false);

  const { uploadMedia, deleteMedia } = useMedia();

  /* ================= GET PUBLIC ================= */
  const getTestimonials = async (callback?: BasicCallback): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await api.get<TestimonialsResponse>("/testimonials");

      if (!data.success) {
        throw new Error(data.message);
      }

      setTestimonials(data.data ?? []);

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

  /* ================= GET ADMIN ================= */
  const getAdminTestimonials = async (
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.get<TestimonialsResponse>(
        "/testimonials/admin/all"
      );

      if (!data.success) {
        throw new Error(data.message);
      }

      setTestimonials(data.data ?? []);

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
  const getTestimonialById = async (
    id: string,
    callback?: (testimonial: Testimonial | null) => void
  ): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await api.get<TestimonialResponse>(`/testimonials/${id}`);

      if (!data.success) {
        throw new Error(data.message);
      }

      callback?.(data.data ?? null);
    } catch (error) {
      const handled = handleApiError(error);
      console.error("Error obteniendo testimonio:", handled.message);
      callback?.(null);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CREATE ADMIN ================= */
  const createTestimonial = async (
    form: TestimonialForm,
    file?: File,
    url?: string,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      let foto_media_id = form.foto_media_id ?? null;

      if (file) {
        const media = await uploadMedia(file, "testimonial");
        if (!media) throw new Error("Error subiendo imagen");
        foto_media_id = media.id;
      } else if (url?.trim()) {
        const media = await uploadMedia(url.trim(), "testimonial");
        if (!media) throw new Error("Error guardando URL");
        foto_media_id = media.id;
      }

      const payload = {
        nombre: form.nombre.trim(),
        cargo: form.cargo?.trim() || null,
        empresa: form.empresa?.trim() || null,
        testimonio: form.testimonio.trim(),
        foto_media_id,
        calificacion: form.calificacion ?? 5,
        proyecto_id: form.proyecto_id || null,
        activo: form.activo ?? true,
      };

      const { data } = await apiWithAuth.post<TestimonialResponse>(
        "/testimonials",
        payload
      );

      if (!data.success) {
        throw new Error(data.message);
      }

      setTestimonials([data.data, ...testimonials]);

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

  /* ================= CREATE PUBLIC ================= */
  const createPublicTestimonial = async (
    form: TestimonialForm,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      const payload = {
        nombre: form.nombre?.trim() || "",
        cargo: form.cargo?.trim() || null,
        empresa: form.empresa?.trim() || null,
        testimonio: form.testimonio?.trim() || "",
        calificacion: form.calificacion ?? null,
        proyecto_id: form.proyecto_id || null,
        image_url: form.image_url?.trim() || null,
      };

      const { data } = await api.post<TestimonialResponse>(
        "/testimonials/public",
        payload
      );

      if (!data.success) {
        throw new Error(data.message);
      }

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
  const updateTestimonial = async (
    id: string,
    form: TestimonialForm,
    file?: File,
    url?: string,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      let foto_media_id = form.foto_media_id ?? null;

      if (file) {
        const media = await uploadMedia(file, "testimonial");
        if (!media) throw new Error("Error subiendo imagen");
        foto_media_id = media.id;
      } else if (url?.trim()) {
        const media = await uploadMedia(url.trim(), "testimonial");
        if (!media) throw new Error("Error guardando URL");
        foto_media_id = media.id;
      }

      const payload = {
        nombre: form.nombre.trim(),
        cargo: form.cargo?.trim() || null,
        empresa: form.empresa?.trim() || null,
        testimonio: form.testimonio.trim(),
        foto_media_id,
        calificacion: form.calificacion ?? 5,
        proyecto_id: form.proyecto_id || null,
        activo: form.activo ?? true,
      };

      const { data } = await apiWithAuth.put<TestimonialResponse>(
        `/testimonials/${id}`,
        payload
      );

      if (!data.success) {
        throw new Error(data.message);
      }

      setTestimonials(
        testimonials.map((testimonial) =>
          testimonial.id === id ? data.data : testimonial
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
  const deleteTestimonial = async (
    id: string,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      const current = testimonials.find((testimonial) => testimonial.id === id);

      const { data } = await apiWithAuth.delete<{ success: boolean; message: string }>(
        `/testimonials/${id}`
      );

      if (!data.success) {
        throw new Error(data.message);
      }

      if (current?.foto_media_id) {
        await deleteMedia(current.foto_media_id);
      }

      setTestimonials(
        testimonials.filter((testimonial) => testimonial.id !== id)
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

  /* ================= TOGGLE ================= */
  const toggleTestimonial = async (
    testimonial: Testimonial,
    callback?: BasicCallback
  ): Promise<void> => {
    await updateTestimonial(
      testimonial.id,
      {
        id: testimonial.id,
        nombre: testimonial.nombre,
        cargo: testimonial.cargo,
        empresa: testimonial.empresa,
        testimonio: testimonial.testimonio,
        foto_media_id: testimonial.foto_media_id,
        calificacion: testimonial.calificacion,
        proyecto_id: testimonial.proyecto_id,
        activo: !testimonial.activo,
      },
      undefined,
      undefined,
      callback
    );
  };

  return {
    testimonials,
    loading,
    getTestimonials,
    getAdminTestimonials,
    getTestimonialById,
    createTestimonial,
    createPublicTestimonial,
    updateTestimonial,
    deleteTestimonial,
    toggleTestimonial,
  };
};