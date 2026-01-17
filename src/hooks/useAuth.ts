import { useNavigate } from "react-router-dom";
import { api } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";
import { useAppState } from "./useAppState";

import type {
  ApiSuccessResponse,
  LoginCredentials,
  LoginCallbackResponse,
  BasicCallback,
  SocialLoginPayload,
  UseAuth
} from "@/interfaces/hook/IUseAuth";

export const useAuth = (): UseAuth => {
  const { setRefreshtoken, setAccessToken, setUser } = useAppState();
  const navigate = useNavigate();

  const loginUser = async ( credentials: LoginCredentials, callback?: (response: LoginCallbackResponse) => void ): Promise<void> => {
    try {
      const response = await api.post<ApiSuccessResponse>(
        "/auth/login",
        credentials
      );

      const { success, message, accessToken, refreshToken, field } =
        response.data;

      if (success && accessToken && refreshToken) {
        setAccessToken(accessToken);
        setRefreshtoken(refreshToken);
        callback?.({ success, message });
      } else {
        callback?.({
          success: false,
          message: message ?? "Credenciales incorrectas",
          field,
        });
      }
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({
        success: false,
        message: handled.message,
      });
    }
  };

  const sendResetEmail = async ( correo: string, callback?: BasicCallback ): Promise<void> => {
    try {
      const response = await api.post<ApiSuccessResponse>(
        "/auth/send-reset-email",
        { correo }
      );

      const { success, message } = response.data;

      callback?.({
        success,
        message: message ?? "Correo de recuperación enviado",
      });
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({
        success: false,
        message:
          handled.message || "Error al enviar el correo de recuperación",
      });
    }
  };

  const validateResetToken = async ( token: string, callback?: BasicCallback ): Promise<void> => {
    try {
      const response = await api.post<ApiSuccessResponse>(
        "/auth/validate-reset-token",
        { token }
      );
      const { success, message } = response.data;
      callback?.({ success, message });

    } catch (error) {
      const handled = handleApiError(error);
      callback?.({
        success: false,
        message: handled.message || "Token inválido o expirado",
      });
    }
  };

  const resetPassword = async ( token: string, nuevaContraseña: string, callback?: BasicCallback ): Promise<void> => {
    try {
      const response = await api.post<ApiSuccessResponse>(
        "/auth/reset-password",
        { token, nuevaContraseña }
      );
      const { success, message } = response.data;
      callback?.({
        success,
        message: message ?? "Contraseña cambiada correctamente",
      });
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({
        success: false,
        message: handled.message || "Error al restablecer la contraseña",
      });
    }
  };

  const loginOrRegisterUser = async ( data: SocialLoginPayload, callback?: BasicCallback ): Promise<void> => {
    try {
      const response = await api.post<ApiSuccessResponse>("/auth", data);
      const { success, message, accessToken, refreshToken } = response.data;
      if (success && accessToken && refreshToken) {
        setAccessToken(accessToken);
        setRefreshtoken(refreshToken);
        callback?.({ success, message });
      } else {
        callback?.({
          success: false,
          message: message ?? "Error desconocido",
        });
      }
    } catch (error) {
      const handled = handleApiError(error);
      callback?.({
        success: false,
        message: handled.message || "Error en autenticación automática",
      });
    }
  };

  const registerUser = async (
    data: {
      nombre?: string;
      apellido?: string;
      correo: string;
      telefono?: string;
      dni?: string;
      contrasena?: string;
      proveedor: "correo" | "google";
      type_user?: number;
    },
    callback?: BasicCallback
  ): Promise<void> => {
    try {
      const response = await api.post<ApiSuccessResponse>(
        "/auth/register",
        data
      );

      const { success, message, accessToken, refreshToken } = response.data;

      if (success && accessToken && refreshToken) {
        setAccessToken(accessToken);
        setRefreshtoken(refreshToken);
      }

      callback?.({
        success,
        message: message ?? "Registro exitoso",
      });

    } catch (error) {
      const handled = handleApiError(error);
      callback?.({
        success: false,
        message: handled.message || "Error al registrar usuario",
      });
    }
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshtoken(null);
    setUser(null);
    navigate("/");
  };


  return {
    loginUser,
    sendResetEmail,
    validateResetToken,
    resetPassword,
    loginOrRegisterUser,
    registerUser,
    logout
  };
};
