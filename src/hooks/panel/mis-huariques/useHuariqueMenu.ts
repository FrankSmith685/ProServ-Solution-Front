import { useMemo, useState } from "react";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { useAppState } from "@/hooks/useAppState";

import type { Service } from "@/interfaces/hook/IUseService";

import type {
  MenuItem,
  MenuCategoria,
} from "@/interfaces/panel/mis-huariques/IHuariqueMenu";

import type { IconType } from "react-icons";

/* ================= RETURN TYPE ================= */
interface UseHuariqueMenuReturn {
  categorias: MenuCategoria[];
  loading: boolean;

  createCategoria: () => void;
  updateCategoria: (id: string, data: { nombre: string }) => void;

  createItem: (categoriaId: string, item: MenuItem) => void;
  updateItem: (itemId: string, data: Partial<MenuItem>) => void;
  deleteItem: (itemId: string) => void;

  reorderCategorias: (newOrder: MenuCategoria[]) => void;
  reorderItems: (categoriaId: string, newItems: MenuItem[]) => void;

  status: {
    text: string;
    icon: IconType;
    color: string;
  };

  save: () => Promise<void>;
  isValid: boolean;
}

/* ============================================================ */

export const useHuariqueMenu = (): UseHuariqueMenuReturn => {
  const { service, setService, setServiceSteep, serviceSteep, user } =
    useAppState();

  const [loading, setLoading] = useState<boolean>(false);

  const categorias = useMemo<MenuCategoria[]>(
    () => service?.menu ?? [],
    [service?.menu]
  );

  // ================= VALIDACIÓN =================

  const isValid: boolean = true;

  const status = useMemo(() => {
    if (!categorias.length) {
      return {
        text: "Puedes agregar tu carta más adelante",
        icon: FaExclamationTriangle,
        color: "bg-gray-100 text-gray-600",
      };
    }

    return {
      text: "Carta configurada",
      icon: FaCheckCircle,
      color: "bg-primary-soft text-primary",
    };
  }, [categorias]);

  // ================= WIZARD =================

  const save = async (): Promise<void> => {
    if (loading) return;

    setLoading(true);

    try {
      const nextStep = user?.profileType === "empresa" ? 4 : 3;

      if (serviceSteep < nextStep) {
        setServiceSteep(nextStep);
      }
    } finally {
      setLoading(false);
    }
  };

  // ================= CRUD =================

  const createCategoria = (): void => {
    const nueva: MenuCategoria = {
      id: crypto.randomUUID(),
      nombre: "Nueva categoría",
      items: [],
    };

    setService({
      ...(service as Service),
      menu: [...categorias, nueva],
    });
  };

  const updateCategoria = (id: string, data: { nombre: string }): void => {
    const updated = categorias.map(cat =>
      cat.id === id ? { ...cat, ...data } : cat
    );

    setService({
      ...(service as Service),
      menu: updated,
    });
  };

  const createItem = (categoriaId: string, item: MenuItem): void => {
    const updated = categorias.map(cat => {
      if (cat.id !== categoriaId) return cat;

      return {
        ...cat,
        items: [...cat.items, item],
      };
    });

    setService({
      ...(service as Service),
      menu: updated,
    });
  };

  const updateItem = (itemId: string, data: Partial<MenuItem>): void => {
    const updated = categorias.map(cat => ({
      ...cat,
      items: cat.items.map(item =>
        item.id === itemId ? { ...item, ...data } : item
      ),
    }));

    setService({
      ...(service as Service),
      menu: updated,
    });
  };

  const deleteItem = (itemId: string): void => {
    const updated = categorias.map(cat => ({
      ...cat,
      items: cat.items.filter(item => item.id !== itemId),
    }));

    setService({
      ...(service as Service),
      menu: updated,
    });
  };

  const reorderCategorias = (newOrder: MenuCategoria[]): void => {
    setService({
      ...(service as Service),
      menu: newOrder,
    });
  };

  const reorderItems = (categoriaId: string, newItems: MenuItem[]): void => {
    const updated = categorias.map(cat =>
      cat.id === categoriaId ? { ...cat, items: newItems } : cat
    );

    setService({
      ...(service as Service),
      menu: updated,
    });
  };

  return {
    categorias,
    loading,
    createCategoria,
    updateCategoria,
    createItem,
    updateItem,
    deleteItem,
    status,
    save,
    isValid,
    reorderCategorias,
    reorderItems,
  };
};