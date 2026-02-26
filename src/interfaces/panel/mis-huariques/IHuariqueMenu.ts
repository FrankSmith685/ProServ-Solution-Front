
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import type { ReactNode } from "react";

/* ================= ITEM ================= */

export interface MenuItem {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  disponible: boolean;
  imagen: File | string | null;
}

/* ================= CATEGORÍA ================= */

export interface MenuCategoria {
  id: string;
  nombre: string;
  items: MenuItem[];
}

/* ================= MODAL ================= */

export interface DishModalProps {
  open: boolean;
  initialData?: MenuItem | null;
  onClose: () => void;
  onSave: (item: MenuItem) => void;
}

/* ================= CONTENEDOR PRINCIPAL ================= */

export interface HuariqueMenuContentProps {
  categorias: MenuCategoria[];
  loading: boolean;
  createCategoria: () => void;
  updateCategoria: (id: string, data: { nombre: string }) => void;
  createItem: (categoriaId: string, item: MenuItem) => void;
  updateItem: (id: string, data: Partial<MenuItem>) => void;
  deleteItem: (id: string) => void;
  reorderItems: (categoriaId: string, newItems: MenuItem[]) => void;
}

/* ================= SORTABLE ================= */

export interface SortableItemProps {
  item: MenuItem;
  children: (params: {
    attributes: DraggableAttributes;
    listeners?: SyntheticListenerMap;
  }) => ReactNode;
}