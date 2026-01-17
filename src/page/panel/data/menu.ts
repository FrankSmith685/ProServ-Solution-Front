import {
  FaUser,
  FaStore,
  FaChartBar,
  FaTags,
  FaCog,
} from "react-icons/fa";

export const panelMenuData = [
  {
    label: "Mi Cuenta",
    path: "/panel/mi-cuenta",
    icon: FaUser,
  },
  {
    label: "Mi Huarique",
    path: "/panel/mi-huarique",
    icon: FaStore,
  },
  {
    label: "Estadísticas",
    path: "/panel/estadisticas",
    icon: FaChartBar,
  },
  {
    label: "Promociones",
    path: "/panel/promociones",
    icon: FaTags,
  },
  {
    label: "Config.",
    path: "/panel/configuraciones",
    icon: FaCog,
  },
];
