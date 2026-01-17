import type { FC } from "react";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";
import type { NotificacionesListProps } from "@/interfaces/panel/mis-datos/IPreferencias";


export const NotificacionesList: FC<NotificacionesListProps> = ({
  items,
  onToggle,
}) => {
  return (
    <section className="bg-glass rounded-3xl p-6 space-y-6 w-full">
      {items.map(n => (
        <div
          key={n.TINO_Codigo}
          className="flex items-start justify-between gap-6"
        >
          <div className="flex-1">
            <h3 className="text-sm font-medium text-secondary">
              {n.TINO_Nombre}
            </h3>
            <p className="text-xs text-terciary mt-1">
              {n.TINO_Descripcion}
            </p>
          </div>

          <CustomSwitch
            checked={n.activo}
            size="md"
            variant="primary"
            onChange={(_, checked) =>
              onToggle(n.TINO_Codigo, checked)
            }
          />
        </div>
      ))}
    </section>
  );
};
