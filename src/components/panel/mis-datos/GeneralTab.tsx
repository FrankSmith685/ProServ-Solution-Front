import type { FC } from "react";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import {
  FaPhone,
  FaIdCard,
  FaMapMarkerAlt,
} from "react-icons/fa";
import type {
  GeneralTabProps,
  InfoItem,
} from "@/interfaces/panel/mis-datos/IMisDatos";

export const GeneralTab: FC<GeneralTabProps> = ({
  form,
  ubicacionLabel,
  onNavigate,
}) => {
  const items: readonly InfoItem[] = [
    { key: "telefono", label: "Teléfono", value: form.telefono, icon: FaPhone },
    { key: "dni", label: "DNI", value: form.dni, icon: FaIdCard },
    { key: "ubigeo", label: "Ubicación", value: ubicacionLabel, icon: FaMapMarkerAlt },
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(({ key, label, value, icon: Icon }) => {
          const filled = Boolean(value);

          return (
            <div
              key={String(key)}
              className="relative bg-glass rounded-3xl p-6 shadow-sm transition-all hover:-translate-y-1"
            >
              <div
                className={`absolute -top-4 left-6 w-10 h-10 rounded-2xl flex items-center justify-center ${
                  filled
                    ? "bg-primary text-on-dark"
                    : "bg-terciary-soft text-terciary"
                }`}
              >
                <Icon className="text-sm" />
              </div>

              <div className="pt-6">
                <p className="text-xs text-terciary">{label}</p>
                <p className="text-sm font-medium">
                  {value || "No registrado"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <CustomButton variant="secondary" text="Editar perfil" onClick={() => onNavigate("perfil")} fontSize="14px" className="leading-4!"/>
        <CustomButton variant="secondary" text="Editar documentos" onClick={() => onNavigate("documentos")} fontSize="14px" className="leading-4!"/>
        <CustomButton variant="secondary" text="Editar ubicación" onClick={() => onNavigate("ubicacion")} fontSize="14px" className="leading-4!"/>
      </div>
    </div>
  );
};
