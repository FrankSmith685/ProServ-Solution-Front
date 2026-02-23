import { useMemo, useState } from "react";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { useAppState } from "@/hooks/useAppState";
import { useNavigate } from "react-router-dom";
import type { Service } from "@/interfaces/hook/IUseService";

export interface HuariqueMultimediaForm {
  logo: File | string | null;
  portada: File | string | null;
  galeria: (File | string)[];
}

const initialForm: HuariqueMultimediaForm = {
  logo: null,
  portada: null,
  galeria: [],
};

export const useHuariqueMultimediaForm = () => {
  const { service, setService, setServiceSteep, serviceSteep, user } = useAppState();

  const [form, setForm] = useState<HuariqueMultimediaForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValid = true;

const updateLogo = (file: File | null) => {
  setForm(prev => ({ ...prev, logo: file }));
};
  const updatePortada = (file: File | null) => {
  setForm(prev => ({ ...prev, portada: file }));
};

  const addGaleria = (file: File) => {
    setForm(prev => {
      if (prev.galeria.length >= 3) return prev;
      return { ...prev, galeria: [...prev.galeria, file] };
    });
  };

  const removeGaleria = (index: number) => {
    setForm(prev => ({
      ...prev,
      galeria: prev.galeria.filter((_, i) => i !== index),
    }));
  };

  const save = async () => {
    if (!isValid || loading) return;

    try {
      setLoading(true);

      setService({
        ...(service as Service),
        logo: form.logo,
        portada: form.portada,
        galeria: form.galeria,
      });

      const nextStep = user?.profileType === "empresa" ? 3 : 2;

      if (serviceSteep < nextStep) {
        setServiceSteep(nextStep);
      }

      setTimeout(() => {
        navigate("/panel/mi-huarique/menu");
      }, 0);

    } finally {
      setLoading(false);
    }
  };

  const status = useMemo(() => {
    if (!isValid) {
      return {
        text: "Faltan multimedias",
        icon: FaExclamationTriangle,
        color: "bg-warning-soft text-warning",
      };
    }

    return {
      text: "Multimedias listas",
      icon: FaCheckCircle,
      color: "bg-primary-soft text-primary",
    };
  }, [isValid]);

  return {
    form,
    loading,
    updateLogo,
    updatePortada,
    addGaleria,
    removeGaleria,
    save,
    isValid,
    status,
  };
};
