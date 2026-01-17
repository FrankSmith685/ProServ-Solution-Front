import type { FC } from "react";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { FaIdCard } from "react-icons/fa";
import type { DocumentosTabProps } from "@/interfaces/panel/mis-datos/IMisDatos";

export const DocumentosTab: FC<DocumentosTabProps> = ({
  form,
  onChange,
}) => {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-secondary">
          <FaIdCard className="text-primary" />
          <span>Documento de identidad</span>
        </div>

        <CustomInput
          label="DNI"
          value={form.dni}
          error={Boolean(form.dni) && form.dni.length !== 8}
          helperText="Debe tener 8 dígitos"
          onChange={e => onChange("dni", e.target.value)}
          fullWidth
          size="md"
        />
      </section>
    </div>
  );
};
