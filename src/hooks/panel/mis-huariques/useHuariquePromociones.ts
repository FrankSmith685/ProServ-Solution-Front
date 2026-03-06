import { useMemo, useState } from "react";
import { useAppState } from "@/hooks/useAppState";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import type { Service } from "@/interfaces/hook/IUseService";
import type { Promocion } from "@/interfaces/panel/mis-huariques/IHuariquePromocion";
import type { IconType } from "react-icons";

interface ReturnTypePromos {
  promociones: Promocion[];
  menu: any[];
  loading: boolean;

  createPromocion: (promo: Promocion) => void;
  updatePromocion: (id: string, data: Partial<Promocion>) => void;
  deletePromocion: (id: string) => void;

  status: {
    text: string;
    icon: IconType;
    color: string;
  };

  save: () => Promise<void>;
  isValid: boolean;
}

export const useHuariquePromociones = (): ReturnTypePromos => {
  const { service, setService, setServiceSteep, serviceSteep, user } =
    useAppState();

  const [loading, setLoading] = useState(false);

  const promociones = useMemo<Promocion[]>(
    () => service?.promociones ?? [],
    [service?.promociones]
  );

  const menu = useMemo(
    () => service?.menu ?? [],
    [service?.menu]
  );

  const isValid = true; // opcional validar fechas

  const status = useMemo(() => {
    if (!promociones.length) {
      return {
        text: "Puedes agregar promociones más adelante",
        icon: FaExclamationTriangle,
        color: "bg-gray-100 text-gray-600",
      };
    }

    return {
      text: "Promociones configuradas",
      icon: FaCheckCircle,
      color: "bg-primary-soft text-primary",
    };
  }, [promociones]);

  const save = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const nextStep = user?.profileType === "empresa" ? 5 : 4;

      if (serviceSteep < nextStep) {
        setServiceSteep(nextStep);
      }
    } finally {
      setLoading(false);
    }
  };

  const createPromocion = (promo: Promocion) => {
    setService({
      ...(service as Service),
      promociones: [...promociones, promo],
    });
  };

  const updatePromocion = (id: string, data: Partial<Promocion>) => {
    const updated = promociones.map(p =>
      p.id === id ? { ...p, ...data } : p
    );

    setService({
      ...(service as Service),
      promociones: updated,
    });
  };

  const deletePromocion = (id: string) => {
    setService({
      ...(service as Service),
      promociones: promociones.filter(p => p.id !== id),
    });
  };

  return {
    promociones,
    menu,
    loading,
    createPromocion,
    updatePromocion,
    deletePromocion,
    status,
    save,
    isValid,
  };
};