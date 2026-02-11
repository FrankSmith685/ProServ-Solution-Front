import type { useHuariqueWizard } from "@/hooks/panel/mis-huariques/useHuariqueWizard";
import type { ElementType, FC } from "react";

// Props del header del huarique
export interface HuariqueHeaderProps {
  title: string;
  description: string;
  status: {
    icon: ElementType;
    text: string;
    color: string;
  };
}

// Tabs del wizard principal del huarique
export type HuariqueTab =
  | "info"
  | "ubicacion"
  | "horario"
  | "servicios";

// Tabs internos de empresa 
export type EmpresaTab =
  | "info"
  | "ubicacion";

// Item visual de tab empresa
export interface EmpresaTabItem {
  key: EmpresaTab;
  label: string;
  icon: FC<{ className?: string }>;
}

// Props del selector de mapa
export interface PropsMapPicker {
  lat?: number;
  lng?: number;
  subcategoria?: {
    cod_subcategoria?: number;
    cod_categoria?: number;
    descripcion?: string | null;
  } | null;
  onChange: (lat: number, lng: number) => void;
}
// Retorno del wizard principal
type WizardReturn = ReturnType<typeof useHuariqueWizard>;
// Tipo step del wizard
export type HuariqueStep = Parameters<WizardReturn["getNextStep"]>[0];

// Props de acciones del wizard (guardar, validar, etc)
export interface HuariqueWizardActionsProps {
  loading?: boolean;
  isValidByTab: Record<HuariqueTab, boolean>;
  save?: () => Promise<void>;
  quickSave?: () => Promise<void>;
}