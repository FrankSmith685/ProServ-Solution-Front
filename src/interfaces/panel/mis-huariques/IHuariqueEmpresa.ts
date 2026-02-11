import type { IconType } from "react-icons";
import type { EmpresaTab } from "./IHuarique";

// Modelo del formulario empresa
export interface HuariqueEmpresaForm {
  nombre: string;
  ruc: string;
  departamento: string;
  provincia: string;
  distrito: string;
  direccion: string;
  referencia: string;
  lat: number;
  lng: number;
}
// Props del componente formulario empresa
export interface HuariqueEmpresaFormProps {
  form: HuariqueEmpresaForm;
  onChange: <K extends keyof HuariqueEmpresaForm>(
    key: K,
    value: HuariqueEmpresaForm[K]
  ) => void;
}
// Opción de dirección con coordenadas  
export type AddressOptionEmpresa = {
  label: string;
  lat: number;
  lng: number;
};
// Opción genérica de select empresa
export type SelectOptionEmpresa = {
  value: string;
  label: string;
};
// Estado visual del formulario
export type StatusType = {
  text: string;
  icon: IconType;
  color: string;
};
// Validación por tabs empresa
export type ValidByTab = {
  info: boolean;
  ubicacion: boolean;
};
// Retorno del hook useHuariqueEmpresaForm
export type UseHuariqueEmpresaFormReturn = {
  form: HuariqueEmpresaForm;
  loading: boolean;
  dirty: boolean;
  saved: boolean;
  isValid: boolean;
  isValidByTab: ValidByTab;
  status: StatusType;
  update: <K extends keyof HuariqueEmpresaForm>(
    key: K,
    value: HuariqueEmpresaForm[K]
  ) => void;
  save: () => Promise<void>;
};
// Props acciones del wizard empresa
export interface HuariqueWizardActionsProps {
  loading?: boolean;
  isValidByTab: Record<EmpresaTab, boolean>;
  save?: () => Promise<void>;
}