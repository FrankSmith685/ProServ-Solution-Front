import type { BasicCallback } from "../helpers/IBasicCallbacks";

/* ================= TYPES ================= */

export interface ConfigNosotrosMedia {
  id: string;
  url: string;
}

export interface ConfigNosotros {
  historia_titulo?: string;
  historia_p1?: string;
  historia_p2?: string;
  historia_p3?: string;
  historia_imagen?: ConfigNosotrosMedia | null | string;

  mision?: string;
  vision?: string;

  valor_1_titulo?: string;
  valor_1_desc?: string;
  valor_2_titulo?: string;
  valor_2_desc?: string;
  valor_3_titulo?: string;
  valor_3_desc?: string;
  valor_4_titulo?: string;
  valor_4_desc?: string;

  [key: string]: string | number | ConfigNosotrosMedia | null | undefined;
}

export interface ConfigNosotrosPayload {
  historia_titulo?: string;
  historia_p1?: string;
  historia_p2?: string;
  historia_p3?: string;
  historia_imagen?: string | null;

  mision?: string;
  vision?: string;

  valor_1_titulo?: string;
  valor_1_desc?: string;
  valor_2_titulo?: string;
  valor_2_desc?: string;
  valor_3_titulo?: string;
  valor_3_desc?: string;
  valor_4_titulo?: string;
  valor_4_desc?: string;

  deletedMediaIds?: string[];

  [key: string]:
    | string
    | number
    | string[]
    | ConfigNosotrosMedia
    | null
    | undefined;
}

export interface ConfigNosotrosResponse {
  success: boolean;
  message: string;
  data: ConfigNosotros;
}

/* ================= HOOK ================= */

export interface UseConfigNosotros {
  configNosotros: ConfigNosotros | null;
  getConfigNosotros: (callback?: BasicCallback) => Promise<void>;
  updateConfigNosotros: (
    payload: ConfigNosotrosPayload,
    callback?: BasicCallback
  ) => Promise<void>;
  loading: boolean;
  saving: boolean;
}