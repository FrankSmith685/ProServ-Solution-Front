// src/shared/design/serviceIcons.tsx
import type { ReactNode } from "react";
import {
  Briefcase,
  Palette,
  Code2,
  ShieldCheck,
  Megaphone,
  Wrench,
  BarChart3,
  Globe,
  Smartphone,
  Database,
  Cog,
  LayoutGrid,
} from "lucide-react";

export type ServiceIconKey =
  | "briefcase"
  | "palette"
  | "code"
  | "shield"
  | "marketing"
  | "tools"
  | "analytics"
  | "globe"
  | "mobile"
  | "database"
  | "settings"
  | "grid";

export type ServiceIconItem = {
  key: ServiceIconKey;
  label: string;
  icon: ReactNode;
};

export const SERVICE_ICONS: ServiceIconItem[] = [
  { key: "briefcase", label: "Negocio", icon: <Briefcase size={18} /> },
  { key: "palette", label: "Diseño", icon: <Palette size={18} /> },
  { key: "code", label: "Desarrollo", icon: <Code2 size={18} /> },
  { key: "shield", label: "Seguridad", icon: <ShieldCheck size={18} /> },
  { key: "marketing", label: "Marketing", icon: <Megaphone size={18} /> },
  { key: "tools", label: "Soporte", icon: <Wrench size={18} /> },
  { key: "analytics", label: "Analítica", icon: <BarChart3 size={18} /> },
  { key: "globe", label: "Web", icon: <Globe size={18} /> },
  { key: "mobile", label: "Mobile", icon: <Smartphone size={18} /> },
  { key: "database", label: "Datos", icon: <Database size={18} /> },
  { key: "settings", label: "Automatización", icon: <Cog size={18} /> },
  { key: "grid", label: "Soluciones", icon: <LayoutGrid size={18} /> },
];

export const getServiceIconMeta = (value?: string | null) => {
  return SERVICE_ICONS.find((item) => item.key === value) ?? null;
};