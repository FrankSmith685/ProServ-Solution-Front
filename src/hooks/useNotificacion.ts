import { apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";

import type {
  TipoNotificacion,
  TiposNotificacionesResponse,
  NotificacionesUsuarioResponse,
  ToggleNotificacionResponse,
  UseNotificaciones,
} from "@/interfaces/hook/IUseNotificaciones";

export const useNotificaciones = (): UseNotificaciones => {

  /* ================= GET: catálogo ================= */
  const getTiposNotificaciones = async (): Promise<
    Omit<TipoNotificacion, "activo">[] | null
  > => {
    try {
      const response = await apiWithAuth.get<TiposNotificacionesResponse>(
        "/notificaciones"
      );

      return response.data.data;
    } catch (error) {
      console.error(handleApiError(error).message);
      return null;
    }
  };

  /* ================= GET: usuario ================= */
  const getNotificacionesUsuario = async (): Promise<
    { TINO_Codigo: number; activo: boolean }[] | null
  > => {
    try {
      const response = await apiWithAuth.get<NotificacionesUsuarioResponse>(
        "/notificaciones/usuario"
      );

      return response.data.data.map(n => ({
        TINO_Codigo: n.TipoNotificacion.TINO_Codigo,
        activo: n.UTNO_Activo,
      }));
    } catch (error) {
      console.error(handleApiError(error).message);
      return null;
    }
  };

  /* ================= PUT: toggle ================= */
  const toggleNotificacion = async (
    codigo: number,
    activo: boolean
  ): Promise<boolean> => {
    try {
      const response = await apiWithAuth.put<ToggleNotificacionResponse>(
        `/notificaciones/usuario/${codigo}`,
        { activo }
      );

      return response.data.success;
    } catch (error) {
      console.error(handleApiError(error).message);
      return false;
    }
  };

  return {
    getTiposNotificaciones,
    getNotificacionesUsuario,
    toggleNotificacion,
  };
};
