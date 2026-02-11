
import type { FC } from "react";
import {
  FaInfoCircle,
  FaMapMarkedAlt,
  FaClock,
  FaTruck,
  FaLock,
} from "react-icons/fa";
import { useAppState } from "@/hooks/useAppState";
import type { HuariqueTab } from "@/interfaces/panel/mis-huariques/IHuarique";

// Índice de cada tab para controlar el avance
const TAB_INDEX: Record<HuariqueTab, number> = {
  info: 0,
  ubicacion: 1,
  horario: 2,
  servicios: 3,
};
// Tabs del formulario de Huarique
export const HuariqueTabs: FC = () => {
  // Estado global del wizard
  const { serviceSteepInfo, setActiveInfoTab, activeInfoTab } = useAppState();
  // Configuración de tabs
  const tabs = [
    { key: "info", label: "Información", icon: FaInfoCircle },
    { key: "ubicacion", label: "Ubicación", icon: FaMapMarkedAlt },
    { key: "horario", label: "Horario", icon: FaClock },
    { key: "servicios", label: "Servicios", icon: FaTruck },
  ] as const;

  return (
    <div className="overflow-x-auto grid grid-cols-2 gap-2 sm:flex sm:gap-3">
      {tabs.map(({ key, label, icon: Icon }) => {
        const active = activeInfoTab === key;
        const disabled = TAB_INDEX[key] > serviceSteepInfo;

        return (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setActiveInfoTab(key)}
            className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition
              ${
                disabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : active
                  ? "bg-primary-soft text-primary shadow-sm"
                  : "bg-surface-soft text-terciary hover:bg-terciary-soft"
              }
            `}
          >
            <Icon className="text-sm" />
            <span>{label}</span>
            {disabled && <FaLock className="text-xs" />}
          </button>
        );
      })}
    </div>
  );
};
