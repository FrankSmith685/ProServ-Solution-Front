// src/interfaces/hook/IUseUser.ts

/* ================== TIPOS BASE ================== */

export interface UserTipo {
  cod_tipo_usuario: number;
  descripcion: string;
}

export interface UsuarioActividadMetadata {
  archivo: string;
}

export interface UsuarioActividadInfo {
  USAC_Id: number;
  USUA_Interno: string;
  USAC_Accion: string;
  USAC_Modulo: string;
  USAC_Metadata: UsuarioActividadMetadata | null;
  USAC_Fecha: string;
}

/* ================== RESPONSES ================== */

export interface UpdateUserApiResponse {
  success: boolean;
  message?: string;
  data?: UserInfo;
}

export interface UserActivityResponse {
  success: boolean;
  message?: string;
  data?: UserActivity;
}

export interface UserActivity {
  ultimaActividadPerfil: UsuarioActividadInfo | null;
  ultimaActividadFoto: UsuarioActividadInfo | null;
}

export type UserTypeProfile =  "empresa" | "independiente" | null;

/* ================== USER ================== */

export interface UserInfo {
  cod_usuario: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string | null;
  dni: string | null;
  fotoPerfil: string | null;
  estado: boolean;
  fechaRegistro: string;
  ultimaSesion: string;
  profileType: UserTypeProfile;
  tipo_usuario: UserTipo[];
 metodosLogin: LoginProvider[];
  tieneEmpresa: boolean;
  tieneServicio: boolean;
  serviciosActivos: number;
  idUbigeo: string | null;
  tienePlan: boolean | null;
  planActivo: string | null;
  limiteServicios: number;
  limitePromocional: number;
  tieneVideoPromocional: boolean;
  tieneAviso: boolean;
  ultimaActividadPerfil: UsuarioActividadInfo | null;
  ultimaActividadFoto: UsuarioActividadInfo | null;
}

/* ================== PAYLOADS ================== */

export interface UpdateUserPayload {
  USUA_Interno: string;
  USUA_Nombre?: string;
  USUA_Apellido?: string;
  USUA_Telefono?: string;
  USUA_Dni?: string;
  USUA_Direccion?: string;
  USUA_IdUbigeo?: string;
  USUA_Latitud?: number;
  USUA_Longitud?: number;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ChangeEmailPayload {
  currentEmail: string;
  newEmail: string;
}

export interface LinkAccountPayload {
  proveedor: "correo" | "google";
  emailProveedor: string;
  clave?: string | null;
}

export interface UnlinkAccountPayload {
  proveedor: "correo" | "google";
}

export interface DeleteAccountPayload {
  password: string;
}


export type LoginProvider = "correo" | "google" | "facebook";

export interface UserLoginMethods {
  metodosLogin: LoginProvider[];
}


/* ================== CALLBACKS ================== */

export type UserInfoCallback = (response: {
  success: boolean;
  message?: string;
  user?: UserInfo;
}) => void;

export type UserActivityCallback = (response: {
  success: boolean;
  message?: string;
  activity?: UserActivity;
}) => void;

export interface UpdateUserLoginMethodsResponse {
  success: boolean;
  message?: string;
  data?: UserLoginMethods;
}

export type UserLoginMethodsCallback = (
  response: UpdateUserLoginMethodsResponse
) => void;


/* ================== HOOK ================== */

export interface UseUser {
  getUserInfo: (callback?: UserInfoCallback) => Promise<void>;

  updateUser: (
    data: UpdateUserPayload,
    callback?: UserInfoCallback
  ) => Promise<void>;

  changePassword: (
    data: ChangePasswordPayload,
    callback?: UserInfoCallback
  ) => Promise<void>;

  changeEmail: (
    data: ChangeEmailPayload,
    callback?: UserInfoCallback
  ) => Promise<void>;

  linkAccount: (
    data: LinkAccountPayload,
    callback?: UserLoginMethodsCallback
  ) => Promise<void>;

  unlinkAccount: (
    data: UnlinkAccountPayload,
    callback?: UserLoginMethodsCallback
  ) => Promise<void>;

  deleteAccount: (
    data: DeleteAccountPayload,
    callback?: UserInfoCallback
  ) => Promise<void>;
  deleteAccountGoogle: (
  correo: string,
  callback?: UserInfoCallback
) => Promise<void>;


  getUserActivity: () => Promise<UserActivity | null>;
  setProfileType: (
    profileType: "empresa" | "independiente",
    callback?: UserInfoCallback
  ) => Promise<void>;
}
