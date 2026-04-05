export interface ServiceForm {
  id?: string;
  titulo: string;
  descripcion: string;
  descripcion_larga: string;
  icono: string;
  activo: boolean;
  orden?: number;
}

export interface ServiceUI {
  id: string;
  titulo: string;
  descripcion: string;
  descripcion_larga: string;
  icono: string;
  activo: boolean;
  orden?: number;
  media_id?: string | null;
  imagen_url: string | null;
}

export interface ViewerImageItem {
  src: string;
  alt?: string;
}