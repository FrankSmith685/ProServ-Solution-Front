import { useState } from "react";
import { api, apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";

import type {
  Project,
  ProjectResponse,
  ProjectsResponse,
  UseProjects,
} from "@/interfaces/hook/IUseProjects";

import type { BasicCallback } from "@/interfaces/helpers/IBasicCallbacks";

import { useMedia } from "./useMedia";
import { useAppState } from "./useAppState";

export const useProjects = (): UseProjects => {
  const {projects, setProjects} = useAppState();
  const [loading, setLoading] = useState<boolean>(false);

  const { uploadMedia, deleteMedia } = useMedia();

  /* ================= GET ================= */
  const getProjects = async (callback?: BasicCallback): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await api.get<ProjectsResponse>("/projects");

      if (!data.success) {
        throw new Error(data.message);
      }

      setProjects(data.data);

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
  const getProjectById = async (
    id: string,
    callback?: (project: Project | null) => void
  ): Promise<void> => {
    setLoading(true);

    try {
      const { data } = await api.get<ProjectResponse>(`/projects/${id}`);

      if (!data.success) {
        throw new Error(data.message);
      }

      callback?.(data.data);
    } catch (error) {
      const handled = handleApiError(error);
      console.error("Error obteniendo proyecto:", handled.message);
      callback?.(null);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CREATE ================= */
  const createProject = async (
    form: Partial<Project>,
    files: File[] = [],
    urls: string[] = [],
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      const uploadedMediaIds: string[] = [];

      for (const file of files) {
        const media = await uploadMedia(file, "project");
        if (!media) throw new Error("Error subiendo una imagen del proyecto");
        uploadedMediaIds.push(media.id);
      }

      for (const url of urls) {
        const cleanUrl = url.trim();
        if (!cleanUrl) continue;

        const media = await uploadMedia(cleanUrl, "project");
        if (!media) throw new Error("Error guardando una URL del proyecto");
        uploadedMediaIds.push(media.id);
      }

      const existingImageIds =
        (form.images ?? []).map((image) => image.media_id).filter(Boolean) ?? [];

      const image_ids = [...existingImageIds, ...uploadedMediaIds];

      if (!form.titulo?.trim()) {
        throw new Error("El título es obligatorio");
      }

      if (!form.servicio_id) {
        throw new Error("El servicio es obligatorio");
      }

      if (!form.categoria_id) {
        throw new Error("La categoría es obligatoria");
      }

      if (!image_ids.length) {
        throw new Error("Debes agregar al menos una imagen");
      }

      const { data } = await apiWithAuth.post<ProjectResponse>("/projects", {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion?.trim() || null,
        cliente: form.cliente?.trim() || null,
        servicio_id: form.servicio_id,
        categoria_id: form.categoria_id,
        destacado: form.destacado ?? false,
        activo: form.activo ?? true,
        image_ids,
        tag_ids: form.tags?.map((tag) => tag.id) ?? [],
      });

      if (!data.success) {
        throw new Error(data.message);
      }

      setProjects([...projects, data.data]);

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
  const updateProject = async (
    id: string,
    form: Partial<Project>,
    files: File[] = [],
    urls: string[] = [],
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      const current = projects.find((project) => project.id === id);

      const existingImageIds =
        form.images?.map((image) => image.media_id).filter(Boolean) ?? [];

      const uploadedMediaIds: string[] = [];

      for (const file of files) {
        const media = await uploadMedia(file, "project");
        if (!media) throw new Error("Error subiendo una imagen del proyecto");
        uploadedMediaIds.push(media.id);
      }

      for (const url of urls) {
        const cleanUrl = url.trim();
        if (!cleanUrl) continue;

        const media = await uploadMedia(cleanUrl, "project");
        if (!media) throw new Error("Error guardando una URL del proyecto");
        uploadedMediaIds.push(media.id);
      }

      const image_ids = [...existingImageIds, ...uploadedMediaIds];

      if (!form.titulo?.trim()) {
        throw new Error("El título es obligatorio");
      }

      if (!form.servicio_id) {
        throw new Error("El servicio es obligatorio");
      }

      if (!form.categoria_id) {
        throw new Error("La categoría es obligatoria");
      }

      if (!image_ids.length) {
        throw new Error("Debes agregar al menos una imagen");
      }

      const { data } = await apiWithAuth.put<ProjectResponse>(`/projects/${id}`, {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion?.trim() || null,
        cliente: form.cliente?.trim() || null,
        servicio_id: form.servicio_id,
        categoria_id: form.categoria_id,
        destacado: form.destacado ?? false,
        activo: form.activo ?? true,
        image_ids,
        tag_ids: form.tags?.map((tag) => tag.id) ?? [],
      });

      if (!data.success) {
        throw new Error(data.message);
      }

      const oldImages = current?.images ?? [];
      const newImages = data.data.images ?? [];

      const newMediaIds = newImages.map((img) => img.media_id);
      const removedMediaIds = oldImages
        .map((img) => img.media_id)
        .filter((mediaId) => !newMediaIds.includes(mediaId));

      for (const mediaId of removedMediaIds) {
        try {
          await deleteMedia(mediaId);
        } catch (err) {
          console.error("Error eliminando media removida:", err);
        }
      }

      setProjects(
        projects.map((project) =>
          project.id === id ? data.data : project
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
  const deleteProject = async (
    id: string,
    callback?: BasicCallback
  ): Promise<void> => {
    setLoading(true);

    try {
      const current = projects.find((project) => project.id === id);

      const { data } = await apiWithAuth.delete<{ success: boolean; message: string }>(
        `/projects/${id}`
      );

      if (!data.success) {
        throw new Error(data.message);
      }

      if (current?.images?.length) {
        for (const image of current.images) {
          try {
            await deleteMedia(image.media_id);
          } catch (err) {
            console.error("Error eliminando media del proyecto:", err);
          }
        }
      }

      setProjects(
        projects.filter((project) => project.id !== id)
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
  const toggleProject = async (
    project: Project,
    callback?: BasicCallback
  ): Promise<void> => {
    await updateProject(
      project.id,
      {
        ...project,
        activo: !project.activo,
      },
      [],
      [],
      callback
    );
  };

  return {
    projects,
    loading,
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    toggleProject,
  };
};