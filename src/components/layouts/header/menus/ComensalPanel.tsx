import {
  FaUser,
  FaHeart,
  FaUtensils,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { UserPanelItem } from "../UserPanelItem";
import { UserPanelDivider } from "../UserPanelDivider";
import type { JSX } from "react";
import { useAuth } from "@/hooks/useAuth";

export const ComensalPanel = (): JSX.Element => {
  const {logout} = useAuth();
  return (
    <>
      <UserPanelItem
        icon={<FaUser />}
        label="Mi cuenta"
        to="/panel/mi-cuenta"
      />

      <UserPanelItem
        icon={<FaHeart />}
        label="Favoritos"
        to="/favoritos"
      />

      <UserPanelItem
        icon={<FaUtensils />}
        label="Explorar huariques"
        to="/servicios?m=map"
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
        onClick={async() => {
          await logout()
        }}
      />
    </>
  );
};
