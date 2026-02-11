import type { FC } from "react";
import {
  FaInfoCircle,
  FaMapMarkedAlt,
  FaLock,
} from "react-icons/fa";
import { useAppState } from "@/hooks/useAppState";
import type { EmpresaTab, EmpresaTabItem } from "@/interfaces/panel/mis-huariques/IHuarique";
// Índice de pasos por tab
const TAB_INDEX: Record<EmpresaTab, number> = {
  info: 0,
  ubicacion: 1,
};
// Tabs del wizard de empresa
export const EmpresaTabs: FC = () => {
  // Estado del wizard
  const {
    serviceSteepEmpresa,
    setActiveEmpresaTab,
    activeEmpresaTab,
  } = useAppState();
  // Definición de tabs
  const tabs: readonly EmpresaTabItem[] = [
    {
      key: "info",
      label: "Información",
      icon: FaInfoCircle,
    },
    {
      key: "ubicacion",
      label: "Ubicación",
      icon: FaMapMarkedAlt,
    },
  ];

  return (
    <div className="overflow-x-auto grid grid-cols-2 gap-2 sm:flex sm:gap-3">
      {tabs.map(({ key, label, icon: Icon }) => {
        const active: boolean = activeEmpresaTab === key;
        const disabled: boolean = TAB_INDEX[key] > serviceSteepEmpresa;

        return (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                setActiveEmpresaTab(key);
              }
            }}
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
