import type { SidebarSubMenuItem } from "@/interfaces/ui/navigation/ICustomSidebarSubMenu";
import {
  FaInfoCircle,
  FaImages,
  FaUtensils,
  FaTags,
  FaRocket,
  FaCog,
  FaBuilding,
} from "react-icons/fa";

export const miHuariqueMenuData: readonly SidebarSubMenuItem[] = [
  {
    type: "link",
    label: "Empresa",
    path: "/panel/mi-huarique/empresa",
    icon: FaBuilding,
  },
  {
    type: "link",
    label: "Información",
    path: "/panel/mi-huarique/info",
    icon: FaInfoCircle,
  },
  {
    type: "link",
    label: "Multimedia",
    path: "/panel/mi-huarique/multimedia",
    icon: FaImages,
  },
  {
    type: "link",
    label: "Carta / Menú",
    path: "/panel/mi-huarique/menu",
    icon: FaUtensils,
  },
  {
    type: "link",
    label: "Promociones",
    path: "/panel/mi-huarique/promociones",
    icon: FaTags,
  },
  {
    type: "link",
    label: "Publicación",
    path: "/panel/mi-huarique/publicacion",
    icon: FaRocket,
  },
  {
    type: "link",
    label: "Configuración",
    path: "/panel/mi-huarique/configuracion",
    icon: FaCog,
  },
] as const;
