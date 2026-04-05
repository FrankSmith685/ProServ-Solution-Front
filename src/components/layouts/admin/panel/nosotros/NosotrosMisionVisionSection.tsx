import type { FC } from "react";
import { Target, Eye } from "lucide-react";

import { CustomInput } from "@/components/ui/kit/CustomInput";

import type { NosotrosMisionVisionSectionProps } from "@/interfaces/layouts/admin/panel/nosotros/INosotrosMisionVisionSection";

const NosotrosMisionVisionSection: FC<NosotrosMisionVisionSectionProps> = ({
  form,
  onTextChange,
}) => {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-6 lg:col-span-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Target size={20} />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-primary sm:text-lg">
              Misión
            </h3>
            <p className="text-sm text-muted-foreground">
              Define el propósito principal de la empresa.
            </p>
          </div>
        </div>

        <CustomInput
          label="Misión"
          value={form.mision}
          onChange={onTextChange("mision")}
          placeholder="Describe la misión de la empresa..."
          multiline
          rows={6}
          fullWidth
        />
      </div>

      <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-6 lg:col-span-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Eye size={20} />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-primary sm:text-lg">
              Visión
            </h3>
            <p className="text-sm text-muted-foreground">
              Define hacia dónde quiere llegar la empresa.
            </p>
          </div>
        </div>

        <CustomInput
          label="Visión"
          value={form.vision}
          onChange={onTextChange("vision")}
          placeholder="Describe la visión de la empresa..."
          multiline
          rows={6}
          fullWidth
        />
      </div>
    </div>
  );
};

export default NosotrosMisionVisionSection;