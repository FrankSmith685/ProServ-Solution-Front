import type { BasicCallback } from "../helpers/IBasicCallbacks";

/* ================= MEDIA ================= */
export interface ServiceMedia {
  id: string;
  url: string;
  tipo: string;
  alt: string | null;
  tamaño: number | null;
  created_at: string;
}

/* ================= FORM ================= */
export interface ServiceForm {
  titulo?: string;
  descripcion?: string | null;
  descripcion_larga?: string | null;
  icono?: string | null;
  media_id?: string | null;
  orden?: number | null;
  activo?: boolean;
}

/* ================= SERVICE ================= */
export interface Service {
  id: string;
  titulo: string;
  descripcion: string | null;
  descripcion_larga: string | null;
  icono: string | null;
  media_id: string | null;
  orden: number | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
  media?: ServiceMedia | null;
  image_url?: string | null;
}

export interface ServiceResponse {
  success: boolean;
  message: string;
  data: Service;
}

export interface ServicesResponse {
  success: boolean;
  message: string;
  data: Service[];
}

export interface UseServices {
  services: Service[];
  loading: boolean;

  getServices: (callback?: BasicCallback) => Promise<void>;
  getServiceById: (
    id: string,
    callback?: (service: Service | null) => void
  ) => Promise<void>;

  createService: (
    form: ServiceForm,
    file?: File,
    url?: string,
    callback?: BasicCallback
  ) => Promise<void>;

  updateService: (
    id: string,
    form: ServiceForm,
    file?: File,
    url?: string,
    callback?: BasicCallback
  ) => Promise<void>;

  deleteService: (
    id: string,
    callback?: BasicCallback
  ) => Promise<void>;

  toggleService: (service: Service) => Promise<void>;
}