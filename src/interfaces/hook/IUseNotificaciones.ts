/* ================== BASE ================== */

export interface TipoNotificacion {
  TINO_Codigo: number;
  TINO_Nombre: string;
  TINO_Descripcion: string;
  activo: boolean;
}

/* ================== RESPONSES ================== */

// GET /notificaciones
export interface TiposNotificacionesResponse {
  success: boolean;
  message?: string;
  data: {
    TINO_Codigo: number;
    TINO_Nombre: string;
    TINO_Descripcion: string;
  }[];
}

// GET /notificaciones/usuario
export interface NotificacionesUsuarioResponse {
  success: boolean;
  message?: string;
  data: {
    UTNO_Id: number;
    USUA_Interno: string;
    TINO_Id: number;
    UTNO_Activo: boolean;
    TipoNotificacion: {
      TINO_Codigo: number;
      TINO_Nombre: string;
      TINO_Descripcion: string;
    };
  }[];
}

// PUT /notificaciones/usuario/:id
export interface ToggleNotificacionResponse {
  success: boolean;
  message?: string;
}

/* ================== HOOK ================== */

export interface UseNotificaciones {
  /** Catálogo de tipos */
  getTiposNotificaciones: () => Promise<
    Omit<TipoNotificacion, "activo">[] | null
  >;

  /** Estado de notificaciones del usuario */
  getNotificacionesUsuario: () => Promise<{
    TINO_Codigo: number;
    activo: boolean;
  }[] | null>;

  /** Activar / desactivar */
  toggleNotificacion: (
    codigo: number,
    activo: boolean
  ) => Promise<boolean>;
}
