/* eslint-disable @typescript-eslint/no-explicit-any */
/* ================= LOGIN ================= */

import type { BasicCallback } from "../helpers/IBasicCallbacks";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    user: {
      id: string;
      email: string;
      role: number;
    };
    accessToken: string;
    refreshToken: string;
  };
}
/* ================= User ================= */
export interface AuthUser {
  id: string;
  nombre: string;
  email: string;
  role_id: number;
  activo: boolean;
  ultimo_login: string | null;
  created_at: string;
  updated_at: string;
  company_id: string;

  role: {
    id: number;
    nombre: string;
    descripcion: string;
    permisos: string;
    created_at: string;
    updated_at: string;
  };

  company: {
    id: string;
    nombre: string;
    razon_social: string;
    ruc: string;
    email: string;
    telefono: string;
    direccion: string;
    logo_media_id: string | null;
    favicon_media_id: string | null;
    activo: boolean;
    created_at: string;
    updated_at: string;
  };

  logs: any[];
}

/* ================= CALLBACKS ================= */

export interface LoginCallbackResponse {
  success: boolean;
  message?: string;
  field?: string;
}


export interface MeResponse {
  success: boolean;
  message: string;
  data: AuthUser;
}

/* ================= HOOK ================= */

export interface UseAuth {
  loginUser: (
    credentials: LoginCredentials,
    callback?: (response: LoginCallbackResponse) => void
  ) => Promise<void>;

  validateResetToken: (
    token: string,
    callback?: BasicCallback
  ) => Promise<void>;

  logout: () => void;

  // usuario
  getCurrentUser: () => Promise<void>;
}