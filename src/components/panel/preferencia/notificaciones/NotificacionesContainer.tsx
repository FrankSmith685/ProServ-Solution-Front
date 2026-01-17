import { FaBell } from "react-icons/fa";
import { NotificacionesList } from "./NotificacionesList";
import { PreferenciasHeader } from "./PreferenciaHeader";
import { useNotificacionesForm } from "@/hooks/panel/mis-cuenta/notificaciones/useNotificacionesForm";
import type { PreferenciasHeaderProps } from "@/interfaces/panel/mis-datos/IPreferencias";
import { CustomLoaderSpinner } from "@/components/loader/CustomLoaderSpinner";

export const NotificacionesContainer = () => {
  const { items, loading, toggle } = useNotificacionesForm();

  const status = {
    text: "Los cambios se guardan automáticamente",
    color: "bg-success-soft text-success",
    icon: FaBell,
  } satisfies PreferenciasHeaderProps["status"];

  return (
    <div className="w-full space-y-10">
      <PreferenciasHeader
        icon={FaBell}
        title="Notificaciones"
        description="Configura qué notificaciones deseas recibir"
        status={status}
      />

      {loading ? (
        <CustomLoaderSpinner />
      ) : (
        <NotificacionesList
          items={items}
          onToggle={toggle}
        />
      )}
    </div>
  );
};
