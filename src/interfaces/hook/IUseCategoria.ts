/* ================== ENTIDADES ================== */

export interface Subcategoria {
  SUBC_Id: number;
  SUBC_Nombre: string;
  SUBC_Descripcion: string;
  CATE_Id: number;
}

export interface Categoria {
  CATE_Id: number;
  CATE_Nombre: string;
  CATE_Descripcion: string;
  Subcategorias: Subcategoria[];
}

/* ================== RESPONSES ================== */

export interface GetCategoriasResponse {
  success: boolean;
  message?: string;
  data?: Categoria[];
}

/* ================== CALLBACKS ================== */

export type CategoriasCallback = (response: {
  success: boolean;
  message?: string;
  categorias?: Categoria[];
}) => void;

/* ================== HOOK ================== */

export interface UseCategoria {
  getCategorias: (callback?: CategoriasCallback) => Promise<void>;
}
