import { useEffect, useMemo, useState } from "react";
import { FaCheckCircle,FaExclamationTriangle,
} from "react-icons/fa";
import { useAppState } from "@/hooks/useAppState";
import type { HuariqueEmpresaForm, StatusType, UseHuariqueEmpresaFormReturn, ValidByTab } from "@/interfaces/panel/mis-huariques/IHuariqueEmpresa";
import type { Company } from "@/interfaces/hook/IUseCompany";

// Estado inicial del formulario de empresa
const initialForm: HuariqueEmpresaForm = {
  nombre: "",
  ruc: "",
  departamento: "",
  provincia: "",
  distrito: "",
  direccion: "",
  referencia: "",
  lat: 0,
  lng: 0,
};
// Mapea el formulario al modelo Company
const mapFormToCompany = (form: HuariqueEmpresaForm): Company => ({
  nombre: form.nombre,
  ruc: form.ruc,
  departamento: form.departamento,
  provincia: form.provincia,
  distrito: form.distrito,
  direccion: form.direccion,
  referencia: form.referencia || null,
  lat: form.lat,
  lng: form.lng,
});
// Hook que maneja el formulario de empresa
export const useHuariqueEmpresaForm = (): UseHuariqueEmpresaFormReturn => {
  // Estado global de la aplicación
  const {
    company,
    setCompany,
    setServiceSteep,
    serviceSteepEmpresa,
  } = useAppState();
  // Estado local del formulario
  const [form, setForm] = useState<HuariqueEmpresaForm>(initialForm);
  // Estado de carga al guardar
  const [loading, setLoading] = useState<boolean>(false);
  // Indica si los datos fueron guardados
  const [saved, setSaved] = useState<boolean>(false);
  // Inicializa el formulario desde company
  useEffect(() => {
    if (!company) return;
    setForm({
      nombre: company.nombre ?? "",
      ruc: company.ruc ?? "",
      departamento: company.departamento ?? "",
      provincia: company.provincia ?? "",
      distrito: company.distrito ?? "",
      direccion: company.direccion ?? "",
      referencia: company.referencia ?? "",
      lat: company.lat ?? 0,
      lng: company.lng ?? 0,
    });
  }, [company]);
  // Marca como guardado si existe company
  useEffect(() => {
    setSaved(Boolean(company));
  }, [company]);
  // Detecta cambios sin guardar
  const dirty = useMemo<boolean>(() => {
    if (!company) return true;
    return JSON.stringify(form) !== JSON.stringify(company);
  }, [form, company]);
  // Validación del tab Información
  const isInfoValid: boolean = Boolean(
    form.nombre.trim() &&
    form.ruc.trim()
  );
  // Validación del tab Ubicación
  const isUbicacionValid: boolean = Boolean(
    form.departamento &&
    form.provincia &&
    form.distrito &&
    form.direccion &&
    form.lat !== 0 &&
    form.lng !== 0
  );
  // Validación según el paso actual
  const isValid = useMemo<boolean>(() => {
    switch (serviceSteepEmpresa) {
      case 0:
        return isInfoValid;
      case 1:
        return isUbicacionValid;
      default:
        return false;
    }
  }, [serviceSteepEmpresa, isInfoValid, isUbicacionValid]);
  // Validación por pestaña
  const isValidByTab: ValidByTab = {
    info: isInfoValid,
    ubicacion: isUbicacionValid,
  };
  // Actualiza un campo del formulario
  const update = <K extends keyof HuariqueEmpresaForm>(
    key: K,
    value: HuariqueEmpresaForm[K]
  ): void => {
    setSaved(false);
    setForm(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  // Guarda la información de la empresa
  const save = async (): Promise<void> => {
    if (!isValid || loading) return;

    try {
      setLoading(true);
      const companyData = mapFormToCompany(form);
      setCompany(companyData);
      setSaved(true);
      setServiceSteep(1);
    } finally {
      setLoading(false);
    }
  };
  // Estado visual del formulario
  const status = useMemo<StatusType>(() => {
    if (!isValid) {
      return {
        text: "Datos incompletos",
        icon: FaExclamationTriangle,
        color: "bg-warning-soft text-warning",
      };
    }

    return {
      text: "Completo",
      icon: FaCheckCircle,
      color: "bg-primary-soft text-primary",
    };
  }, [isValid]);

  return {
    form,
    loading,
    dirty,
    saved,
    isValid,
    isValidByTab,
    status,
    update,
    save,
  };
};
