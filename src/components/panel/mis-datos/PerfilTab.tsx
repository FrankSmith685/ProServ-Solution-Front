import type { FC } from "react";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { FaUser, FaPhone } from "react-icons/fa";
import type { PerfilTabProps } from "@/interfaces/panel/mis-datos/IMisDatos";

export const PerfilTab: FC<PerfilTabProps> = ({
  form,
  onChange,
}) => {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-secondary">
          <FaUser className="text-primary" />
          <span>Información personal</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <CustomInput
            label="Nombres"
            value={form.nombre}
            onChange={e => onChange("nombre", e.target.value)}
            fullWidth
            size="md"
          />

          <CustomInput
            label="Apellidos"
            value={form.apellido}
            onChange={e => onChange("apellido", e.target.value)}
            fullWidth
            size="md"
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-secondary">
          <FaPhone className="text-primary" />
          <span>Contacto</span>
        </div>

        <CustomInput
          label="Teléfono"
          value={form.telefono}
          onChange={e => onChange("telefono", e.target.value)}
          fullWidth
          size="md"
        />
      </section>
    </div>
  );
};
