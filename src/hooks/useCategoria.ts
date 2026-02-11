
import { useCallback } from "react";
import { api } from "@/api/apiConfig";
import { handleApiError } from "@/api/apiError";

import type {
  GetCategoriasResponse,
  UseCategoria,
  CategoriasCallback,
} from "@/interfaces/hook/IUseCategoria";
import { useAppState } from "./useAppState";

export const useCategoria = (): UseCategoria => {
  const {setCategories} = useAppState();

  const getCategorias = useCallback(
  async (callback?: CategoriasCallback): Promise<void> => {
    try {
      const response = await api.get<GetCategoriasResponse>("/categoria");

      const data = response.data.data ?? [];

      setCategories(data);

      callback?.({
        success: response.data.success,
        message: response.data.message,
        categorias: data,
      });
    } catch (error) {
      const handled = handleApiError(error);

      callback?.({
        success: false,
        message: handled.message,
      });
    }
  },
  [setCategories]
);


  return {
    getCategorias,
  };
};
