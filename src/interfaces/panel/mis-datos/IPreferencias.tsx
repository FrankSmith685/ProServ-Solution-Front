import type { TipoNotificacion } from "@/interfaces/hook/IUseNotificaciones";
import type { IconType } from "react-icons";

export interface NotificacionesListProps {
  items: TipoNotificacion[];
  onToggle: (codigo: number, value: boolean) => void;
}

export interface PreferenciasHeaderStatus {
  text: string;
  color: string;
  icon: IconType;
}

export interface PreferenciasHeaderProps {
  icon: IconType;
  title: string;
  description: string;
  status: PreferenciasHeaderStatus;
}
