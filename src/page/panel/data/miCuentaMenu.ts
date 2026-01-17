import type { SidebarSubMenuItem } from "@/interfaces/ui/navigation/ICustomSidebarSubMenu";
import { FaIdCard, FaLock, FaSlidersH } from "react-icons/fa";

export const miCuentaMenuData: readonly SidebarSubMenuItem[] = [
  {
    type: "link",
    label: "Mis Datos",
    path: "/panel/mi-cuenta/datos",
    icon: FaIdCard,
  },
  {
    type: "link",
    label: "Seguridad",
    path: "/panel/mi-cuenta/seguridad/password",
    icon: FaLock,
  },
  {
    type: "link",
    label: "Preferencias",
    path: "/panel/mi-cuenta/preferencias",
    icon: FaSlidersH,
  },
] as const;
