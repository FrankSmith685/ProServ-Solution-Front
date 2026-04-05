import type { BasicCallback } from "../helpers/IBasicCallbacks";

/* ================= TYPES ================= */

export interface ConfigMedia {
  id: string;
  url: string;
}

export interface ConfigHome {
  hero_title?: string;
  hero_subtitle?: string;
  hero_cta?: string;

  services_title?: string;
  projects_title?: string;

  stats_anos_valor?: string;
  stats_proyectos_valor?: string;
  stats_clientes_valor?: string;
  stats_colaboradores_valor?: string;

  about_titulo?: string;
  about_descripcion?: string;
  about_descripcion2?: string;
  about_anos?: string;
  about_imagen?: ConfigMedia | null | string;

  cta_titulo?: string;
  cta_descripcion?: string;

  [key: string]: string | number | ConfigMedia | null | undefined;
}

export interface ConfigHomePayload {
  hero_title?: string;
  hero_subtitle?: string;
  hero_cta?: string;

  services_title?: string;
  projects_title?: string;

  stats_anos_valor?: string;
  stats_proyectos_valor?: string;
  stats_clientes_valor?: string;
  stats_colaboradores_valor?: string;

  about_titulo?: string;
  about_descripcion?: string;
  about_descripcion2?: string;
  about_anos?: string;
  about_imagen?: string | null;
  deletedMediaIds?: string[];

  cta_titulo?: string;
  cta_descripcion?: string;

  [key: string]: string | number | string[] | ConfigMedia | null | undefined;
}

export interface ConfigHomeResponse {
  success: boolean;
  message: string;
  data: ConfigHome;
}

/* ================= HOOK ================= */

export interface UseConfigHome {
  getConfigHome: (callback?: BasicCallback) => Promise<void>;
  updateConfigHome: (
    payload: ConfigHomePayload,
    callback?: BasicCallback
  ) => Promise<void>;
  loading: boolean;
  saving: boolean;
}