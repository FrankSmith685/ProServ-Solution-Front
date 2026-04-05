import { useState } from "react";
import { api, apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";

import type {
  Tag,
  TagResponse,
  TagsResponse,
  UseTags,
} from "@/interfaces/hook/IUseTags";

import type { BasicCallback } from "@/interfaces/helpers/IBasicCallbacks";
import { useAppState } from "./useAppState";

export const useTags = (): UseTags => {
  // const [tags, setTags] = useState<Tag[]>([]);
  const {tags, setTags} = useAppState();
  const [loading, setLoading] = useState<boolean>(false);

  const getTags = async (callback?: BasicCallback): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await api.get<TagsResponse>("/tags");

      if (!data.success) {
        throw new Error(data.message);
      }

      setTags(data.data);

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

  const getTagById = async (
    id: string,
    callback?: (tag: Tag | null) => void
  ): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await api.get<TagResponse>(`/tags/${id}`);

      if (!data.success) {
        throw new Error(data.message);
      }

      callback?.(data.data);
    } catch (error) {
      const handled = handleApiError(error);
      console.error("Error obteniendo tag:", handled.message);
      callback?.(null);
    } finally {
      setLoading(false);
    }
  };

  const createTag = async (
    form: Partial<Tag>,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      if (!form.nombre?.trim()) {
        throw new Error("El nombre del tag es obligatorio");
      }

      const { data } = await apiWithAuth.post<TagResponse>("/tags", {
        nombre: form.nombre.trim(),
        slug: form.slug?.trim() || undefined,
        activo: form.activo ?? true,
      });

      if (!data.success) {
        throw new Error(data.message);
      }

      setTags(
        [...tags, data.data].sort((a, b) =>
          a.nombre.localeCompare(b.nombre)
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

  const updateTag = async (
    id: string,
    form: Partial<Tag>,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.put<TagResponse>(`/tags/${id}`, {
        nombre: form.nombre?.trim(),
        slug: form.slug?.trim() || undefined,
        activo: form.activo,
      });

      if (!data.success) {
        throw new Error(data.message);
      }

      setTags(
        tags
          .map((tag) => (tag.id === id ? data.data : tag))
          .sort((a, b) => a.nombre.localeCompare(b.nombre))
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

  const deleteTag = async (
    id: string,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.delete<{ success: boolean; message: string }>(
        `/tags/${id}`
      );

      if (!data.success) {
        throw new Error(data.message);
      }

      setTags(
        tags.filter((tag) => tag.id !== id)
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

  const toggleTag = async (
    tag: Tag,
    callback?: BasicCallback
  ): Promise<void> => {
    await updateTag(
      tag.id,
      {
        ...tag,
        activo: !tag.activo,
      },
      callback
    );
  };

  return {
    tags,
    loading,
    getTags,
    getTagById,
    createTag,
    updateTag,
    deleteTag,
    toggleTag,
  };
};