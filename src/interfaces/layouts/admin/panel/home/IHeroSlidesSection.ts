export interface HeroSlideUI {
  id: string;
  titulo: string;
  subtitulo: string;
  badge: string;
  cta_texto: string;
  cta_path: string;
  imagen_url: string | null;
  activo: boolean;
  orden?: number;
}

export interface HeroSlideForm {
  id?: string;
  titulo: string;
  subtitulo: string;
  badge: string;
  cta_texto: string;
  cta_path: string;
  activo: boolean;
  orden?: number;
}

export interface ViewerImageItem {
  src: string;
  alt?: string;
}