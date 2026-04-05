import type { Dispatch, SetStateAction } from "react";
import type { Testimonial } from "@/interfaces/hook/IUseTestimonials";

export type TestimonialForm = {
  id?: string;
  nombre: string;
  cargo: string;
  empresa: string;
  testimonio: string;
  foto_media_id: string | null;
  calificacion: number;
  proyecto_id: string;
  activo: boolean;
};

export type TestimonialUI = Testimonial & {
  photo_url: string | null;
  project_name: string;
};

export type TestimonialProjectOption = {
  id: string;
  titulo: string;
};

export type TestimonialModalTouchedState = {
  nombre: boolean;
  testimonio: boolean;
};

export type TestimonialModalErrors = {
  nombre: boolean;
  testimonio: boolean;
};

export interface ModalAdminTestimonialProps {
  open: boolean;
  onClose: () => void;
  form: TestimonialForm;
  setForm: Dispatch<SetStateAction<TestimonialForm>>;
  setFile: Dispatch<SetStateAction<File | null>>;
  setImageUrl: Dispatch<SetStateAction<string | null>>;
  onSave: () => void;
  loading?: boolean;
  isEdit?: boolean;
  initialImage?: string | null;
  projects: TestimonialProjectOption[];
}