import type { BasicCallback } from "../helpers/IBasicCallbacks";

/* ================= MEDIA ================= */
export interface TestimonialMedia {
  id: string;
  url: string;
  tipo: string;
  alt: string | null;
  tamaño: number | null;
  created_at: string;
}

/* ================= PROJECT ================= */
export interface TestimonialProject {
  id: string;
  titulo: string;
  descripcion: string | null;
  cliente: string | null;
  servicio_id: string;
  categoria_id: string;
  fecha: string | null;
  destacado: boolean;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

/* ================= FORM ================= */
export interface TestimonialForm {
  id?: string;
  nombre: string;
  cargo: string | null;
  empresa: string | null;
  testimonio: string;
  foto_media_id?: string | null;
  calificacion: number | null;
  proyecto_id: string | null;
  activo: boolean;
  image_url?: string | null;
}

/* ================= TESTIMONIAL ================= */
export interface Testimonial {
  id: string;
  nombre: string;
  cargo: string | null;
  empresa: string | null;
  testimonio: string;
  foto_media_id: string | null;
  calificacion: number | null;
  proyecto_id: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
  photo?: TestimonialMedia | null;
  project?: TestimonialProject | null;
  image_url?: string | null;
}

export interface TestimonialResponse {
  success: boolean;
  message: string;
  data: Testimonial;
}

export interface TestimonialsResponse {
  success: boolean;
  message: string;
  data: Testimonial[];
}

export interface UseTestimonials {
  testimonials: Testimonial[];
  loading: boolean;

  getTestimonials: (callback?: BasicCallback) => Promise<void>;
  getAdminTestimonials: (callback?: BasicCallback) => Promise<void>;
  getTestimonialById: (
    id: string,
    callback?: (testimonial: Testimonial | null) => void
  ) => Promise<void>;

  createTestimonial: (
    form: TestimonialForm,
    file?: File,
    url?: string,
    callback?: BasicCallback
  ) => Promise<void>;

  createPublicTestimonial: (
    form: TestimonialForm,
    callback?: BasicCallback
  ) => Promise<void>;

  updateTestimonial: (
    id: string,
    form: TestimonialForm,
    file?: File,
    url?: string,
    callback?: BasicCallback
  ) => Promise<void>;

  deleteTestimonial: (
    id: string,
    callback?: BasicCallback
  ) => Promise<void>;

  toggleTestimonial: (
    testimonial: Testimonial,
    callback?: BasicCallback
  ) => Promise<void>;
}