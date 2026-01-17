
import type { UserActivity } from "@/interfaces/hook/IUseUser";

/* ================== PAYLOADS ================== */

export interface FileUploadPayload {
  entidad: string;
  entidadId: string;
  tipo: string;
  file: File;
}

export interface FileDeletePayload {
  archivoId: string;
}

export interface FileGetPayload {
  entidad: string;
  entidadId: string;
  tipo?: string;
}

/* ================== MODELOS ================== */

export interface FileInfo {
  ARCH_FechaSubida: string;
  ARCH_ID: string;
  ARCH_Entidad: string;
  ARCH_EntidadId: string;
  ARCH_Tipo: string;
  ARCH_NombreOriginal: string;
  ARCH_Ruta: string;
}

export interface FileUploadResponseData {
  archivo: FileInfo;
  actividad?: UserActivity | null;
}

/* ================== CALLBACK ================== */

export interface FileCallback<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

/* ================== HOOK ================== */

export interface UseFile {
  uploadFile: (
    payload: FileUploadPayload,
    callback?: (res: FileCallback<FileUploadResponseData>) => void
  ) => Promise<void>;

  updateFile: (
    payload: FileUploadPayload,
    callback?: (res: FileCallback<FileUploadResponseData>) => void
  ) => Promise<void>;

  deleteFile: (
  payload: FileDeletePayload,
  callback?: (res: FileCallback<{ actividad?: UserActivity | null }>) => void
) => Promise<void>;

  getFiles: (
    payload: FileGetPayload,
    callback?: (res: FileCallback<FileInfo[]>) => void
  ) => Promise<void>;
}
