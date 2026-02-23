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
import { useAuth } from "@/hooks/useAuth";
import { useAppState } from "@/hooks/useAppState";

export const VendedorPanel = (): JSX.Element => {
  const {logout} = useAuth();
  const {
    setServiceSteep, 
    setVisitedServiceSteep,
    setActiveServiceSteep, 
    setService, 
    setCompany, 
    setServiceSteepInfo, 
    setServiceSteepEmpresa, 
    setActiveInfoTab, 
    setActiveEmpresaTab 
  } = useAppState();
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
        onClick={() => {
          setServiceSteep(0);
          setVisitedServiceSteep([]);
          setActiveServiceSteep('info');
          setService(null);
          setCompany(null);
          setServiceSteepInfo(0);
          setServiceSteepEmpresa(0);
          setActiveInfoTab("info");
          setActiveEmpresaTab('info');
        }}
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
        onClick={async() => {
          await logout()
        }}
      />
    </>
  );
};
