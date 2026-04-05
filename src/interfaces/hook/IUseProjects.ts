import type { BasicCallback } from "../helpers/IBasicCallbacks";

/* ================= MEDIA ================= */
export interface ProjectMedia {
  id: string;
  url: string;
  tipo: string;
  alt: string | null;
  tamaño: number | null;
  created_at?: string;
}

/* ================= RELATIONS ================= */
export interface ProjectServiceRef {
  id: string;
  titulo: string;
}

export interface ProjectCategoryRef {
  id: string;
  nombre: string;
}

export interface ProjectTagRef {
  id: string;
  nombre: string;
  slug?: string;
}

export interface ProjectImage {
  id: string;
  proyecto_id: string;
  media_id: string;
  orden: number | null;
  media?: ProjectMedia | null;
}

/* ================= PROJECT ================= */
export interface Project {
  id: string;
  titulo: string;
  descripcion: string | null;
  cliente: string | null;
  servicio_id: string;
  categoria_id: string;

  // ✅ sí viene del backend, solo lectura en frontend
  fecha: string | null;

  destacado: boolean;
  activo: boolean;
  created_at: string;
  updated_at: string;

  service?: ProjectServiceRef | null;
  category?: ProjectCategoryRef | null;
  tags?: ProjectTagRef[];
  images?: ProjectImage[];
}

export interface ProjectResponse {
  success: boolean;
  message: string;
  data: Project;
}

export interface ProjectsResponse {
  success: boolean;
  message: string;
  data: Project[];
}

export interface UseProjects {
  projects: Project[];
  loading: boolean;

  getProjects: (callback?: BasicCallback) => Promise<void>;
  getProjectById: (
    id: string,
    callback?: (project: Project | null) => void
  ) => Promise<void>;

  createProject: (
    form: Partial<Project>,
    files?: File[],
    urls?: string[],
    callback?: BasicCallback
  ) => Promise<void>;

  updateProject: (
    id: string,
    form: Partial<Project>,
    files?: File[],
    urls?: string[],
    callback?: BasicCallback
  ) => Promise<void>;

  deleteProject: (id: string, callback?: BasicCallback) => Promise<void>;

  toggleProject: (project: Project, callback?: BasicCallback) => Promise<void>;
}