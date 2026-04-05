import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { ProjectImage, ProjectTagRef } from "@/interfaces/hook/IUseProjects";
import type { Service } from "@/interfaces/hook/IUseServices";
import type { Category } from "@/interfaces/hook/IUseCategories";
import type { Tag } from "@/interfaces/hook/IUseTags";

export interface ViewerImageItem {
  src: string;
  alt?: string;
}

export interface ProjectForm {
  id?: string;
  titulo: string;
  descripcion: string;
  cliente: string;
  servicio_id: string;
  categoria_id: string;
  destacado: boolean;
  activo: boolean;
  tags: ProjectTagRef[];
  images: ProjectImage[];
}

export interface ProjectUI {
  id: string;
  titulo: string;
  descripcion: string;
  cliente: string;
  servicio_id: string;
  categoria_id: string;
  fecha: string | null;
  destacado: boolean;
  activo: boolean;
  service_name: string;
  category_name: string;
  tags: ProjectTagRef[];
  images: ProjectImage[];
  first_image_url: string | null;
}

export interface ProjectModalTouchedState {
  titulo: boolean;
  servicio_id: boolean;
  categoria_id: boolean;
  imagenes: boolean;
}

export interface ProjectModalErrors {
  titulo: boolean;
  servicio_id: boolean;
  categoria_id: boolean;
  imagenes: boolean;
}

export interface ModalAdminProjectProps {
  open: boolean;
  onClose: () => void;
  form: ProjectForm;
  setForm: Dispatch<SetStateAction<ProjectForm>>;
  setFiles: Dispatch<SetStateAction<File[]>>;
  setImageUrls: Dispatch<SetStateAction<string[]>>;
  onSave: () => Promise<void> | void;
  loading?: boolean;
  isEdit?: boolean;

  services: Service[];
  categories: Category[];
  tags: Tag[];
}

export interface CrudMiniItemProps {
  title: string;
  icon: ReactNode;
}