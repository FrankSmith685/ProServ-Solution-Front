import type { BasicCallback } from "../helpers/IBasicCallbacks";

export interface Media {
  id: string;
  url: string;
  path?: string;
  folder?: string;
  tipo: string;
  alt?: string | null;
  tamaño: number;
  created_at: string;
  exists?: boolean;
}

export interface UploadMediaResponse {
  success: boolean;
  message: string;
  data: Media;
}

export interface MediaListResponse {
  success: boolean;
  message: string;
  data: Media[];
}

export interface MediaFilters {
  search?: string;
  folder?: string;
  mimeType?: string;
}

export interface UseMedia {
  uploadMedia: (
    file: File | string,
    folder?: string,
    callback?: BasicCallback
  ) => Promise<Media | null>;

  getMedia: (
    id: string,
    callback?: BasicCallback
  ) => Promise<Media | null>;

  getAllMedia: (
    filters?: MediaFilters,
    callback?: BasicCallback
  ) => Promise<Media[]>;

  deleteMedia: (
    id: string,
    callback?: BasicCallback
  ) => Promise<boolean>;

  loading: boolean;
}