import type { FC } from "react";
import { Gem } from "lucide-react";

import { CustomInput } from "@/components/ui/kit/CustomInput";

import type { NosotrosValoresSectionProps } from "@/interfaces/layouts/admin/panel/nosotros/INosotrosValoresSection";

const NosotrosValoresSection: FC<NosotrosValoresSectionProps> = ({
  form,
  values,
  onTextChange,
}) => {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {values.map((value) => (
        <div
          key={value.index}
          className="rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-6"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Gem size={20} />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-primary sm:text-lg">
                Valor {value.index}
              </h3>
              <p className="text-sm text-muted-foreground">
                Configura el título y la descripción de este valor.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <CustomInput
              label={`Título valor ${value.index}`}
              value={form[value.titleKey]}
              onChange={onTextChange(value.titleKey)}
              placeholder={`Ej. Valor ${value.index}`}
              fullWidth
            />

            <CustomInput
              label={`Descripción valor ${value.index}`}
              value={form[value.descKey]}
              onChange={onTextChange(value.descKey)}
              placeholder="Describe este valor..."
              multiline
              rows={4}
              fullWidth
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default NosotrosValoresSection;