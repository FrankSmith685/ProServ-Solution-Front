import type { BasicCallback } from "../helpers/IBasicCallbacks";

/* ================= MEDIA ================= */
export interface HeroMedia {
  id: string;
  url: string;
  tipo: string;
  alt: string | null;
  tamaño: number | null;
  created_at: string;
}

/* ================= HERO SLIDE FORM ================= */
export interface HeroSlideForm {
  titulo?: string;
  subtitulo?: string;
  badge?: string;
  cta_texto?: string;
  cta_path?: string;
  media_id?: string;
  orden?: number;
  activo?: boolean;
}

/* ================= CREATE ================= */
export interface HeroSlideCreate {
  titulo: string;
  subtitulo?: string;
  badge?: string;
  cta_texto?: string;
  cta_path?: string;
  media_id: string;
  orden?: number;
  activo?: boolean;
}

/* ================= UPDATE ================= */
export interface HeroSlideUpdate {
  titulo?: string;
  subtitulo?: string;
  badge?: string;
  cta_texto?: string;
  cta_path?: string;
  media_id?: string;
  orden?: number;
  activo?: boolean;
}

/* ================= HERO SLIDE ================= */
export interface HeroSlide {
  id: string;
  titulo: string;
  subtitulo: string;
  badge: string | null;
  cta_texto: string | null;
  cta_path: string | null;
  media_id: string;
  orden: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
  media: HeroMedia | null;
}

export interface HeroSlidesResponse {
  success: boolean;
  message: string;
  data: HeroSlide[];
}

/* ================= HOOK ================= */
export interface UseHeroSlides {
  getHeroSlides: (callback?: BasicCallback) => Promise<void>;

  createSlide: (
    data: HeroSlideForm,
    file?: File,
    url?: string,
    callback?: BasicCallback
  ) => Promise<void>;

  updateSlide: (
    id: string,
    data: HeroSlideForm,
    file?: File,
    url?: string,
    callback?: BasicCallback
  ) => Promise<void>;

  deleteSlide: (
    id: string,
    callback?: BasicCallback
  ) => Promise<void>;

  toggleSlide: (slide: HeroSlide) => Promise<void>;

  loading: boolean;
}