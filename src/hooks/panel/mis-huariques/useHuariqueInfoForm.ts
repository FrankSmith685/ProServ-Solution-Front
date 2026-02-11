/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import type { HuariqueInfoForm } from "@/interfaces/panel/mis-huariques/IHuariqueInfo";
import { useAppState } from "@/hooks/useAppState";
import type { Service } from "@/interfaces/hook/IUseService";

// Estado inicial del formulario de información del servicio
const initialForm: HuariqueInfoForm = {
  nombre: "",
  descripcion: "",
  categoria: "",
  subcategoria: "",

  departamento: "",
  provincia: "",
  distrito: "",
  direccion: "",
  referencia: "",

  lat: 0,
  lng: 0,

  tipoHorario: "normal",
  horaInicio: "",
  horaFin: "",
  diasAtencion: [],

  delivery: false,
};
// Mapea el formulario al modelo Service
const mapFormToService = (form: HuariqueInfoForm): Service => ({
  nombre: form.nombre,
  descripcion: form.descripcion,
  categoria: form.categoria,
  subcategoria: form.subcategoria,

  departamento: form.departamento,
  provincia: form.provincia,
  distrito: form.distrito,
  direccion: form.direccion,
  referencia: form.referencia || null,

  lat: form.lat,
  lng: form.lng,

  tipoHorario: form.tipoHorario,
  horaInicio: form.tipoHorario === "normal" ? form.horaInicio : null,
  horaFin: form.tipoHorario === "normal" ? form.horaFin : null,
  diasAtencion: form.tipoHorario === "normal" ? form.diasAtencion : [],

  delivery: form.delivery,
});
// Hook que maneja el formulario de información del huarique  
export const useHuariqueInfoForm = () => {
  // Estado global de la app
  const {service, setService, setServiceSteep,  company, serviceSteepInfo } = useAppState();
  // Estado local del formulario    
  const [form, setForm] = useState<HuariqueInfoForm>(initialForm);
  // Estado de carga al guardar 
  const [loading, setLoading] = useState(false);
  // Indica si ya fue guardado
  const [saved, setSaved] = useState(false);

  // const {lat, lng} = useLocation();
  // Inicializa ubicación desde company si aún no existe service
  useEffect(() => {
    if (!company) return;
    if (service) return;

    setForm(prev => ({
      ...prev,
      departamento: company.departamento ?? "",
      provincia: company.provincia ?? "",
      distrito: company.distrito ?? "",
      direccion: company.direccion ?? "",
      referencia: company.referencia ?? "",
      lat: company.lat ?? 0,
      lng: company.lng ?? 0,
    }));
  }, [company, service]);

  // Inicializa formulario cuando existe service
  useEffect(() => {
    if (!service) return;
    
    setForm({
      nombre: service.nombre ?? "",
      descripcion: service.descripcion ?? "",
      categoria: service.categoria ?? "",
      subcategoria: service.subcategoria ?? "",

      departamento: service.departamento ?? "",
      provincia: service.provincia ?? "",
      distrito: service.distrito ?? "",
      direccion: service.direccion ?? "",
      referencia: service.referencia ?? "",

      lat: service.lat ?? 0,
      lng: service.lng ?? 0,

      tipoHorario: service.tipoHorario ?? "normal",
      horaInicio: service.horaInicio ?? "",
      horaFin: service.horaFin ?? "",
      diasAtencion: service.diasAtencion ?? [],

      delivery: service.delivery ?? false,
    });
  }, [service]);

  // Detecta cambios sin guardar
  const dirty = useMemo(() => {
    if (!service) return true;
    return JSON.stringify(form) !== JSON.stringify(service);
  }, [form, service]);

  // Validación del tab Información
  const isInfoValid = Boolean(
    form.nombre?.trim() &&
    form.descripcion?.trim() &&
    form.categoria &&
    form.subcategoria
  );

  // Validación del tab Ubicación
  const isUbicacionValid = Boolean(
    form.departamento &&
    form.provincia &&
    form.distrito &&
    form.direccion &&
    form.lat !== 0 &&
    form.lng !== 0
  );

  // Validación del tab Horario
  const isHorarioValid = useMemo(() => {
    if (form.tipoHorario === "24h") return true;

    return Boolean(
      form.horaInicio &&
      form.horaFin &&
      form.diasAtencion.length > 0
    );
  }, [form]); 

  // Validación del tab Servicios (por ahora siempre válido)
  const isServiciosValid = true;

  // Validación según el paso actual
  const isValid = useMemo(() => {
    switch (serviceSteepInfo) {
      case 0:
        return isInfoValid;
      case 1:
        return isUbicacionValid;
      case 2:
        return isHorarioValid;
      case 3:
        return isServiciosValid;
      default:
        return false;
    }
  }, [
    serviceSteepInfo,
    isInfoValid,
    isUbicacionValid,
    isHorarioValid,
  ]);

  // Validación por pestaña
  const isValidByTab = {
    info: isInfoValid,
    ubicacion: isUbicacionValid,
    horario: isHorarioValid,
    servicios: isServiciosValid,
  };

  // Actualiza un campo del formulario
  const update = <K extends keyof HuariqueInfoForm>(
    key: K,
    value: HuariqueInfoForm[K]
  ) => {
    setSaved(false);

    setForm(prev => ({
      ...prev,
      [key]: value,
    }));

  };

  // Guardado rápido sin avanzar paso
  const quickSave = async () => {
    if (!isValid || loading) return;
    try {
      setLoading(true);
      const serviceData = mapFormToService(form);
      setService(serviceData);
      setSaved(true);
    } finally {
      setLoading(false);
    }
  };

   // Guardado principal y avanza al siguiente paso 
  const save = async () => {
    if (!isValid || loading) return;

    try {
      setLoading(true);

      const serviceData = mapFormToService(form);
      setService(serviceData);
      setSaved(true);
      setServiceSteep(2);
    } finally {
      setLoading(false);
    }
  };

  // Estado visual del formulario 
  const status = useMemo(() => {
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
    save,
    update,
    status,
    isValid,
    saved,
    isValidByTab,
    quickSave
  };
};
