import type { BasicCallback } from "../helpers/IBasicCallbacks";

export interface Category {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export interface UseCategories {
  categories: Category[];
  loading: boolean;

  getCategories: (callback?: BasicCallback) => Promise<void>;
  getCategoryById: (
    id: string,
    callback?: (category: Category | null) => void
  ) => Promise<void>;

  createCategory: (
    form: Partial<Category>,
    callback?: BasicCallback
  ) => Promise<void>;

  updateCategory: (
    id: string,
    form: Partial<Category>,
    callback?: BasicCallback
  ) => Promise<void>;

  deleteCategory: (
    id: string,
    callback?: BasicCallback
  ) => Promise<void>;

  toggleCategory: (category: Category, callback?: BasicCallback) => Promise<void>;
}