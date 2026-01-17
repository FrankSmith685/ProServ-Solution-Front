import { SeguridadHeader } from "../SeguridadHeader";
import { FaLink } from "react-icons/fa";
import { CuentasVinculadasList } from "./CuentasVinculadasList";
import { useCuentasVinculadas } from "@/hooks/panel/mis-cuenta/seguridad/useCuentasVinculadas";
import { CuentaVinculadaInfo } from "./CuentasVinculadasInfo";
import { VincularCorreoModal } from "./CuentaVinculadaModal";

export const CuentasVinculadasContainer = () => {
  const {
    cuentas,
    loading,
    onToggle,
    modalCorreoOpen,
    closeCorreoModal,
  } = useCuentasVinculadas();

  return (
    <div className="w-full space-y-10">
      <SeguridadHeader
        icon={FaLink}
        title="Cuentas vinculadas"
        description="Gestiona los métodos con los que accedes a tu cuenta"
        status={{
          icon: FaLink,
          text: "Configuración",
          color: "bg-primary-soft text-primary",
        }}
      />

      <CuentasVinculadasList
        cuentas={cuentas}
        loadingProveedor={loading}
        onToggle={onToggle}
        />


      <CuentaVinculadaInfo />

      <VincularCorreoModal
        open={modalCorreoOpen}
        onClose={closeCorreoModal}
      />
    </div>
  );
};
