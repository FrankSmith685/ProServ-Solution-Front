import type { BasicCallback } from "../helpers/IBasicCallbacks";

export interface Tag {
  id: string;
  nombre: string;
  slug: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface TagResponse {
  success: boolean;
  message: string;
  data: Tag;
}

export interface TagsResponse {
  success: boolean;
  message: string;
  data: Tag[];
}

export interface UseTags {
  tags: Tag[];
  loading: boolean;

  getTags: (callback?: BasicCallback) => Promise<void>;
  getTagById: (
    id: string,
    callback?: (tag: Tag | null) => void
  ) => Promise<void>;

  createTag: (
    form: Partial<Tag>,
    callback?: BasicCallback
  ) => Promise<void>;

  updateTag: (
    id: string,
    form: Partial<Tag>,
    callback?: BasicCallback
  ) => Promise<void>;

  deleteTag: (
    id: string,
    callback?: BasicCallback
  ) => Promise<void>;

  toggleTag: (tag: Tag, callback?: BasicCallback) => Promise<void>;
}