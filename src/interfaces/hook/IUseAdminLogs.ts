import type { BasicCallback } from "../helpers/IBasicCallbacks";

export interface AdminLogUser {
  id: string;
  nombre: string;
  email: string;
}

export interface AdminLog {
  id: string;
  usuario_id: string;
  accion: string;
  entidad: string;
  entidad_id?: string | null;
  ip?: string | null;
  created_at: string;
  user?: AdminLogUser | null;
}

export interface AdminLogResponse {
  success: boolean;
  message: string;
  data: AdminLog;
}

export interface AdminLogsResponse {
  success: boolean;
  message: string;
  data: AdminLog[];
}

export interface UseAdminLogs {
  logs: AdminLog[];
  loading: boolean;
  getAdminLogs: (callback?: BasicCallback) => Promise<void>;
}