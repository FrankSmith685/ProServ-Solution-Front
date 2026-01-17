import {
  FaStore,
  FaUser,
  FaChartLine,
  FaBullhorn,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { UserPanelItem } from "../UserPanelItem";
import { UserPanelDivider } from "../UserPanelDivider";
import type { JSX } from "react";

export const VendedorPanel = (): JSX.Element => {
  return (
    <>
      <UserPanelItem
        icon={<FaUser />}
        label="Mi cuenta"
        to="/panel/mi-cuenta"
      />

      <UserPanelItem
        icon={<FaStore />}
        label="Mi huarique"
        to="/panel/mi-huarique"
      />

      <UserPanelItem
        icon={<FaChartLine />}
        label="Estadísticas"
        to="/panel/estadisticas"
      />

      <UserPanelItem
        icon={<FaBullhorn />}
        label="Promociones"
        to="/panel/promociones"
      />

      <UserPanelItem
        icon={<FaCog />}
        label="Configuración"
        to="/configuracion"
      />

      <UserPanelDivider />

      <UserPanelItem
        icon={<FaSignOutAlt />}
        label="Cerrar sesión"
        danger
        onClick={() => {
          console.log("logout");
        }}
      />
    </>
  );
};
