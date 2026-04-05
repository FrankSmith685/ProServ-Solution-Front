import type { Dispatch, SetStateAction } from "react";
import type { ServiceForm } from "@/interfaces/layouts/admin/panel/services/IServiceSection";

export interface ModalAdminServiceProps {
  open: boolean;
  onClose: () => void;
  form: ServiceForm;
  setForm: Dispatch<SetStateAction<ServiceForm>>;
  setFile: Dispatch<SetStateAction<File | null>>;
  setImageUrl: Dispatch<SetStateAction<string | null>>;
  onSave: () => Promise<void> | void;
  loading?: boolean;
  isEdit?: boolean;
  initialImage?: string;
  takenOrders?: number[];
}

export interface ServiceModalTouchedState {
  titulo: boolean;
  imagen: boolean;
  orden: boolean;
}

export interface ServiceModalErrors {
  titulo: boolean;
  imagen: boolean;
  orden: boolean;
}