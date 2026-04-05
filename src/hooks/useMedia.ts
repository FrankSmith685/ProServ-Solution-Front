import { useState } from "react";
import { apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";

import type {
  UseMedia,
  UploadMediaResponse,
  Media,
  MediaListResponse,
  MediaFilters,
} from "@/interfaces/hook/IUseMedia";
import type { BasicCallback } from "@/interfaces/helpers/IBasicCallbacks";

const buildQueryString = (filters?: MediaFilters): string => {
  if (!filters) return "";

  const params = new URLSearchParams();

  if (filters.search?.trim()) {
    params.append("search", filters.search.trim());
  }

  if (filters.folder?.trim()) {
    params.append("folder", filters.folder.trim());
  }

  if (filters.mimeType?.trim()) {
    params.append("mimeType", filters.mimeType.trim());
  }

  const query = params.toString();
  return query ? `?${query}` : "";
};

export const useMedia = (): UseMedia => {
  const [loading, setLoading] = useState(false);

  /* ================= UPLOAD ================= */
  const uploadMedia = async (
    input: File | string,
    folder: string = "general",
    callback?: BasicCallback
  ): Promise<Media | null> => {
    setLoading(true);

    try {
      let response;

      if (input instanceof File) {
        const formData = new FormData();
        formData.append("file", input);

        response = await apiWithAuth.post<UploadMediaResponse>(
          `/media/upload?folder=${folder}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await apiWithAuth.post<UploadMediaResponse>(
          `/media/upload?folder=${folder}`,
          {
            url: input,
          }
        );
      }

      const { data } = response;

      if (!data.success) throw new Error(data.message);

      callback?.({ success: true, message: data.message });
      return data.data;
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({ success: false, message: handled.message });
      return null;
    } finally {
      setLoading(false);
    }
  };

  /* ================= GET ONE ================= */
  const getMedia = async (
    id: string,
    callback?: BasicCallback
  ): Promise<Media | null> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.get<UploadMediaResponse>(`/media/${id}`);

      if (!data.success) throw new Error(data.message);

      callback?.({ success: true, message: data.message });
      return data.data;
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({ success: false, message: handled.message });
      return null;
    } finally {
      setLoading(false);
    }
  };

  /* ================= GET ALL ================= */
  const getAllMedia = async (
    filters?: MediaFilters,
    callback?: BasicCallback
  ): Promise<Media[]> => {
    setLoading(true);

    try {
      const query = buildQueryString(filters);
      const { data } = await apiWithAuth.get<MediaListResponse>(`/media${query}`);

      if (!data.success) throw new Error(data.message);

      callback?.({ success: true, message: data.message });
      return data.data ?? [];
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({ success: false, message: handled.message });
      return [];
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const deleteMedia = async (
    id: string,
    callback?: BasicCallback
  ): Promise<boolean> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.delete(`/media/${id}`);

      if (!data.success) throw new Error(data.message);

      callback?.({ success: true, message: data.message });
      return true;
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({ success: false, message: handled.message });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadMedia,
    getMedia,
    getAllMedia,
    deleteMedia,
    loading,
  };
};