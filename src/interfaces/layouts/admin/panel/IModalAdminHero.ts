import type { Dispatch, SetStateAction } from "react";
import type { HeroSlideForm } from "./home/IHeroSlidesSection";

export interface ModalAdminHeroProps {
  open: boolean;
  onClose: () => void;
  form: HeroSlideForm;
  setForm: Dispatch<SetStateAction<HeroSlideForm>>;
  setFile: Dispatch<SetStateAction<File | null>>;
  setImageUrl: Dispatch<SetStateAction<string | null>>;
  onSave: () => void;
  loading?: boolean;
  isEdit?: boolean;
  initialImage?: string;
}

export interface HeroModalTouchedState {
  titulo: boolean;
  imagen: boolean;
}

export interface HeroModalErrors {
  titulo: boolean;
  imagen: boolean;
}