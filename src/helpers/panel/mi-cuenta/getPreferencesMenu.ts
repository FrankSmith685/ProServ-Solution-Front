import { FaBell } from "react-icons/fa";
import type { SidebarSubMenuLink } from "@/interfaces/ui/navigation/ICustomSidebarSubMenu";

export const getPreferencesMenu = (): readonly SidebarSubMenuLink[] => {
  return [
    {
      type: "link",
      label: "Notificaciones",
      path: "/panel/mi-cuenta/preferencias/notificaciones",
      icon: FaBell,
    },
  ];
};
