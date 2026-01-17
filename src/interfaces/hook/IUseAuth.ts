// ===============================
// Auth API Base Response
// ===============================
export interface ApiSuccessResponse<T = unknown> {
  success: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  field?: string;
  data?: T;
}

// ===============================
// Login
// ===============================
export interface LoginCredentials {
  correo: string;
  contraseña: string;
  proveedor?: "correo" | "google" | "facebook";
}

export interface LoginCallbackResponse {
  success: boolean;
  message?: string;
  field?: string;
}

// ===============================
// Generic Callback
// ===============================
export type BasicCallbackResponse = {
  success: boolean;
  message?: string;
  field?: string;
};

export type BasicCallback = (response: BasicCallbackResponse) => void;

// ===============================
// Social / Google / Facebook
// ===============================
export interface SocialLoginPayload {
  correo: string;
  proveedor?: "correo" | "google" | "facebook";
  nombre?: string;
  apellido?: string;
  fotoPerfil?: string;
  type_user?: number;
}

// ===============================
// Register
// ===============================
export interface RegisterPayload {
  nombre?: string;
  apellido?: string;
  correo: string;
  telefono?: string;
  dni?: string;
  contrasena?: string;
  proveedor: "correo" | "google";
  type_user?: number;
}


// ===============================
// Hook Return Type
// ===============================
export interface UseAuth {
  loginUser: (
    credentials: LoginCredentials,
    callback?: (response: LoginCallbackResponse) => void
  ) => Promise<void>;

  sendResetEmail: (
    correo: string,
    callback?: BasicCallback
  ) => Promise<void>;

  validateResetToken: (
    token: string,
    callback?: BasicCallback
  ) => Promise<void>;

  resetPassword: (
    token: string,
    nuevaContraseña: string,
    callback?: BasicCallback
  ) => Promise<void>;

  loginOrRegisterUser: (
    data: SocialLoginPayload,
    callback?: BasicCallback
  ) => Promise<void>;

  registerUser: (
    data: RegisterPayload,
    callback?: BasicCallback
  ) => Promise<void>;

  logout: () => void;

}
