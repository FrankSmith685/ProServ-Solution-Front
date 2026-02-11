import { CustomCheckbox } from "@/components/ui/kit/CustomCheckbox";
import type { HuariqueInfoFormProps } from "@/interfaces/panel/mis-huariques/IHuariqueInfo";

export const HuariqueServiciosTab = ({
  form,
  onChange,
}: HuariqueInfoFormProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-secondary">
        Servicios
      </h3>

      <p className="text-xs text-gray-600">
        Indica los servicios adicionales que ofrece tu huarique.
      </p>

      <CustomCheckbox
        label="Tiene servicio de delivery"
        checked={form.delivery}
        onChange={() => onChange("delivery", !form.delivery)}
      />
    </div>
  );
}
// );
