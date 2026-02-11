import {
  FaUser,
  FaStore,
  FaInfoCircle,
  FaImages,
  FaUtensils,
  FaTags,
  FaRocket,
  FaCog,
  FaBuilding,
} from "react-icons/fa";
import type { SidebarSubMenuSection } from "@/interfaces/ui/navigation/ICustomSidebarSubMenu";

export const sidebarMenus: Record<string, SidebarSubMenuSection> = {
  "mi-cuenta": {
    title: "Mi Cuenta",
    icon: FaUser,
    menuData: [
      {
        type: "link",
        label: "Mis Datos",
        path: "/panel/mi-cuenta/datos",
        icon: FaInfoCircle,
      },
      {
        type: "group",
        label: "Seguridad",
        icon: FaCog,
        children: [],
      },
      {
        type: "group",
        label: "Preferencias",
        icon: FaCog,
        children: [],
      },
    ],
  },

  "mi-huarique": {
    title: "Mi Huarique",
    icon: FaStore,
    menuData: [
      {
        type: "link",
        label: "Empresa",
        path: "/panel/mi-huarique/empresa",
        icon: FaBuilding,
        disabled: true
      },
      {
        type: "link",
        label: "Información",
        path: "/panel/mi-huarique/info",
        icon: FaInfoCircle,
        disabled: true
      },
      {
        type: "link",
        label: "Imágenes",
        path: "/panel/mi-huarique/imagenes",
        icon: FaImages,
        disabled: true
      },
      {
        type: "link",
        label: "Carta / Menú",
        path: "/panel/mi-huarique/menu",
        icon: FaUtensils,
        disabled: true
      },
      {
        type: "link",
        label: "Promociones",
        path: "/panel/mi-huarique/promociones",
        icon: FaTags,
        disabled: true
      },
      {
        type: "link",
        label: "Publicación",
        path: "/panel/mi-huarique/publicacion",
        icon: FaRocket,
        disabled: true
      },
      {
        type: "link",
        label: "Configuración",
        path: "/panel/mi-huarique/configuracion",
        icon: FaCog,
        disabled: false
      },
    ],
  },
};
