import { useState } from "react";
import { api, apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";

import type {
  HeroSlide,
  HeroSlideForm,
  HeroSlidesResponse,
  UseHeroSlides,
} from "@/interfaces/hook/IUseHeroSlides";

import type { BasicCallback } from "@/interfaces/helpers/IBasicCallbacks";

import { useMedia } from "./useMedia";
import { useAppState } from "./useAppState";

export const useHeroSlides = (): UseHeroSlides => {
  const { heroSlide, setHeroSlide } = useAppState();
  const [loading, setLoading] = useState<boolean>(false);

  const { uploadMedia, deleteMedia } = useMedia();

  const slides = heroSlide ?? [];

  /* ================= GET ================= */
  const getHeroSlides = async (callback?: BasicCallback): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await api.get<HeroSlidesResponse>("/hero-slides");

      if (!data.success) {
        throw new Error(data.message);
      }

      setHeroSlide(data.data);

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

  /* ================= CREATE ================= */
  const createSlide = async (
    dataForm: HeroSlideForm,
    file?: File,
    url?: string,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      let media_id = dataForm.media_id;

      if (file) {
        const media = await uploadMedia(file, "hero_slide");
        if (!media) {
          throw new Error("Error subiendo imagen");
        }
        media_id = media.id;
      } else if (url) {
        const media = await uploadMedia(url, "hero_slide");
        if (!media) {
          throw new Error("Error guardando URL");
        }
        media_id = media.id;
      }

      if (!media_id) {
        throw new Error("Imagen requerida");
      }

      const payload: HeroSlideForm = {
        ...dataForm,
        media_id,
      };

      const { data } = await apiWithAuth.post("/hero-slides", payload);

      if (!data.success) {
        throw new Error(data.message);
      }

      setHeroSlide([...(slides ?? []), data.data]);

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
  const updateSlide = async (
    id: string,
    dataForm: HeroSlideForm,
    file?: File,
    url?: string,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      let media_id = dataForm.media_id;

      if (file) {
        const media = await uploadMedia(file, "hero_slide");
        if (!media) {
          throw new Error("Error subiendo imagen");
        }
        media_id = media.id;
      } else if (url) {
        const media = await uploadMedia(url, "hero_slide");
        if (!media) {
          throw new Error("Error guardando URL");
        }
        media_id = media.id;
      }

      const payload: HeroSlideForm = {
        ...dataForm,
        ...(media_id ? { media_id } : {}),
      };

      const { data } = await apiWithAuth.put(`/hero-slides/${id}`, payload);

      if (!data.success) {
        throw new Error(data.message);
      }

      setHeroSlide(slides.map((slide) => (slide.id === id ? data.data : slide)));

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
  const deleteSlide = async (
    id: string,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      const slide = slides.find((item) => item.id === id);

      const { data } = await apiWithAuth.delete(`/hero-slides/${id}`);

      if (!data.success) {
        throw new Error(data.message);
      }

      if (slide?.media_id) {
        await deleteMedia(slide.media_id);
      }

      setHeroSlide(slides.filter((item) => item.id !== id));

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
  const toggleSlide = async (slide: HeroSlide): Promise<void> => {
    await updateSlide(slide.id, {
      activo: !slide.activo,
    });
  };

  return {
    getHeroSlides,
    createSlide,
    updateSlide,
    deleteSlide,
    toggleSlide,
    loading,
  };
};