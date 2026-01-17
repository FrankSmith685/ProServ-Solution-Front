import type { UserActivity } from "@/interfaces/hook/IUseUser";
import { apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";

import type {
  FileUploadPayload,
  FileDeletePayload,
  FileGetPayload,
  FileCallback,
  FileUploadResponseData,
  FileInfo,
  UseFile,
} from "@/interfaces/hook/IUseFile";

export const useFile = (): UseFile => {

  const uploadFile = async (
    { entidad, entidadId, tipo, file }: FileUploadPayload,
    callback?: (res: FileCallback<FileUploadResponseData>) => void
  ): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("entidad", entidad);
      formData.append("entidadId", entidadId);
      formData.append("tipo", tipo);
      formData.append("file", file);

      const response = await apiWithAuth.post(
        "/file/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          transformRequest: v => v,
        }
      );

      callback?.({
        success: true,
        message: response.data?.message,
        data: response.data?.data,
      });
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({ success: false, message: handled.message });
    }
  };

  const updateFile = async (
    { entidad, entidadId, tipo, file }: FileUploadPayload,
    callback?: (res: FileCallback<FileUploadResponseData>) => void
  ): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("entidad", entidad);
      formData.append("entidadId", entidadId);
      formData.append("tipo", tipo);
      formData.append("file", file);

      const response = await apiWithAuth.put(
        "/file/update",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          transformRequest: v => v,
        }
      );

      callback?.({
        success: true,
        message: response.data?.message,
        data: response.data?.data,
      });
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({ success: false, message: handled.message });
    }
  };

  const deleteFile = async (
    { archivoId }: FileDeletePayload,
    callback?: (res: FileCallback<{ actividad?: UserActivity | null }>) => void
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.delete(`/file/delete/${archivoId}`);

      callback?.({
        success: true,
        message: response.data?.message,
        data: response.data?.data,
      });
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({ success: false, message: handled.message });
    }
  };

  const getFiles = async (
    { entidad, entidadId, tipo }: FileGetPayload,
    callback?: (res: FileCallback<FileInfo[]>) => void
  ): Promise<void> => {
    try {
      const response = await apiWithAuth.get(
        `/file/${entidad}/${entidadId}`,
        { params: tipo ? { tipo } : undefined }
      );

      callback?.({
        success: true,
        data: response.data?.data,
      });
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({ success: false, message: handled.message });
    }
  };

  return {
    uploadFile,
    updateFile,
    deleteFile,
    getFiles,
  };
};
