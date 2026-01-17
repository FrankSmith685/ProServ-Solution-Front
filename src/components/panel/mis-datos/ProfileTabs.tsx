import type { FC } from "react";
import {
  FaInfoCircle,
  FaUser,
  FaIdCard,
  FaMapMarkedAlt,
} from "react-icons/fa";
import type {
  ProfileTabsProps,
  TabItem,
} from "@/interfaces/panel/mis-datos/IMisDatos";

export const ProfileTabs: FC<ProfileTabsProps> = ({
  tab,
  onChange,
}) => {
  const tabs: readonly TabItem[] = [
    { key: "general", label: "General", icon: FaInfoCircle },
    { key: "perfil", label: "Perfil", icon: FaUser },
    { key: "documentos", label: "Documentos", icon: FaIdCard },
    { key: "ubicacion", label: "Ubicación", icon: FaMapMarkedAlt },
  ];

  return (
    <div className="overflow-x-auto grid grid-cols-2 gap-2 sm:flex sm:gap-3">
      {tabs.map(({ key, label, icon: Icon }) => {
        const active = tab === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition
              ${
                active
                  ? "bg-primary-soft text-primary shadow-sm"
                  : "bg-surface-soft text-terciary hover:bg-terciary-soft"
              }
              sm:inline-flex sm:rounded-full sm:px-5 sm:py-2.5
            `}
          >
            <Icon className="shrink-0 text-sm" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};
