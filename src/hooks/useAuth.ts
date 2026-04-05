import { useNavigate } from "react-router-dom";
import { api, apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";
import { useAppState } from "./useAppState";

import type {
  LoginCredentials,
  LoginResponse,
  LoginCallbackResponse,
  UseAuth,
  MeResponse
} from "@/interfaces/hook/IUseAuth";
import type { BasicCallback } from "@/interfaces/helpers/IBasicCallbacks";

export const useAuth = (): UseAuth => {
  const { setRefreshtoken, setAccessToken, setUser } = useAppState();
  const navigate = useNavigate();

  const loginUser = async (
    credentials: LoginCredentials,
    callback?: (response: LoginCallbackResponse) => void
  ): Promise<void> => {
    try {
      const { data } = await api.post<LoginResponse>("/auth/login", credentials);
      const { success, message, data: payload } = data;

      if (success && payload?.accessToken && payload?.refreshToken) {
        console.log(payload.accessToken);
        setAccessToken(payload.accessToken);
        setRefreshtoken(payload.refreshToken);

        // await getCurrentUser();

        callback?.({
          success: true,
          message
        });
        return;
      }

      callback?.({
        success: false,
        message: message ?? "Credenciales incorrectas"
      });
    } catch (error) {
      const handled = handleApiError(error);

      callback?.({
        success: false,
        message: handled.message
      });
    }
  };

  const validateResetToken = async (
    token: string,
    callback?: BasicCallback
  ): Promise<void> => {
    try {
      const { data } = await api.post<LoginResponse>(
        "/auth/validate-reset-token",
        { token }
      );

      const { success, message } = data;

      callback?.({
        success,
        message
      });
    } catch (error) {
      const handled = handleApiError(error);

      callback?.({
        success: false,
        message: handled.message || "Token inválido o expirado"
      });
    }
  };

  const logout = (): void => {
    setAccessToken(null);
    setRefreshtoken(null);
    setUser(null);
    navigate("/admin");
  };

  const getCurrentUser = async (): Promise<void> => {
    try {
      const { data } = await apiWithAuth.get<MeResponse>("/auth/me");

      if (data.success && data.data) {
        setUser(data.data);
      }
    } catch (error) {
      const handled = handleApiError(error);
      console.error("Error obteniendo usuario:", handled.message);

      // opcional: si falla, limpias sesión
      setUser(null);
      setAccessToken(null);
      setRefreshtoken(null);
    }
  };

  return {
    loginUser,
    validateResetToken,
    logout,
    getCurrentUser
  };
};