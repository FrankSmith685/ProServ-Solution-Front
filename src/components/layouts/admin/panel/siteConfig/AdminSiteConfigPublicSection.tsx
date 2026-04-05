import type { FC } from "react";
import { Globe } from "lucide-react";

import { CustomInput } from "@/components/ui/kit/CustomInput";

import type { AdminSiteConfigPublicSectionProps } from "@/interfaces/page/admin/panel/IAdminSiteConfig";

const AdminSiteConfigPublicSection: FC<AdminSiteConfigPublicSectionProps> = ({
  form,
  fields,
  onChange,
}) => {
  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Globe size={20} />
        </div>

        <div>
          <h3 className="text-base font-extrabold text-primary sm:text-lg">
            Datos públicos del sitio
          </h3>
          <p className="text-sm text-muted-foreground">
            Configuración visible en frontend, SEO básico y enlaces de contacto.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {fields.map((field) => (
          <CustomInput
            key={field.key}
            label={field.label}
            placeholder={field.placeholder}
            value={String(form[field.key] ?? "")}
            onChange={onChange(field.key)}
            type={field.type === "textarea" ? "text" : field.type ?? "text"}
            multiline={field.type === "textarea"}
            rows={field.type === "textarea" ? 4 : undefined}
            fullWidth
          />
        ))}
      </div>
    </div>
  );
};

export default AdminSiteConfigPublicSection;