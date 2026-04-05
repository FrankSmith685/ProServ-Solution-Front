import { useState } from "react";
import { api, apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";

import type {
  Category,
  CategoryResponse,
  CategoriesResponse,
  UseCategories,
} from "@/interfaces/hook/IUseCategories";

import type { BasicCallback } from "@/interfaces/helpers/IBasicCallbacks";
import { useAppState } from "./useAppState";

export const useCategories = (): UseCategories => {
  const {categories, setCategories} = useAppState();
  const [loading, setLoading] = useState<boolean>(false);

  const getCategories = async (callback?: BasicCallback): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await api.get<CategoriesResponse>("/categories");

      if (!data.success) {
        throw new Error(data.message);
      }

      setCategories(data.data);

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

  const getCategoryById = async (
    id: string,
    callback?: (category: Category | null) => void
  ): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await api.get<CategoryResponse>(`/categories/${id}`);

      if (!data.success) {
        throw new Error(data.message);
      }

      callback?.(data.data);
    } catch (error) {
      const handled = handleApiError(error);
      console.error("Error obteniendo categoría:", handled.message);
      callback?.(null);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (
    form: Partial<Category>,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      if (!form.nombre?.trim()) {
        throw new Error("El nombre de la categoría es obligatorio");
      }

      const { data } = await apiWithAuth.post<CategoryResponse>("/categories", {
        nombre: form.nombre.trim(),
        slug: form.slug?.trim() || undefined,
        descripcion: form.descripcion?.trim() || null,
        activo: form.activo ?? true,
      });

      if (!data.success) {
        throw new Error(data.message);
      }

      setCategories(
        [...categories, data.data].sort((a, b) =>
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

  const updateCategory = async (
    id: string,
    form: Partial<Category>,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.put<CategoryResponse>(`/categories/${id}`, {
        nombre: form.nombre?.trim(),
        slug: form.slug?.trim() || undefined,
        descripcion: form.descripcion?.trim() || null,
        activo: form.activo,
      });

      if (!data.success) {
        throw new Error(data.message);
      }

      setCategories(
        categories
          .map((category) => (category.id === id ? data.data : category))
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

  const deleteCategory = async (
    id: string,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await apiWithAuth.delete<{ success: boolean; message: string }>(
        `/categories/${id}`
      );

      if (!data.success) {
        throw new Error(data.message);
      }

      setCategories(
        categories.filter((category) => category.id !== id)
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

  const toggleCategory = async (
    category: Category,
    callback?: BasicCallback
  ): Promise<void> => {
    await updateCategory(
      category.id,
      {
        ...category,
        activo: !category.activo,
      },
      callback
    );
  };

  return {
    categories,
    loading,
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategory,
  };
};