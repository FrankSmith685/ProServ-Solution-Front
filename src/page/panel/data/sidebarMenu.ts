import type { SidebarSubMenuSection } from "@/interfaces/ui/navigation/ICustomSidebarSubMenu";
import {
  FaUser,
  FaIdCard,
  FaLock,
  FaSlidersH,
} from "react-icons/fa";

export const sidebarMenus: Record<string, SidebarSubMenuSection> = {
  "mi-cuenta": {
    title: "Mi Cuenta",
    icon: FaUser,
    menuData: [
      {
        type: "link",
        label: "Mis Datos",
        path: "/panel/mi-cuenta/datos",
        icon: FaIdCard,
      },
      {
        type: "group",
        label: "Seguridad",
        icon: FaLock,
        children: [],
      },
      {
        type: "link",
        label: "Preferencias",
        path: "/panel/mi-cuenta/preferencias",
        icon: FaSlidersH,
      },
    ],
  },
};
