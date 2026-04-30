/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, type FC } from "react";
import { Globe } from "lucide-react";

import { CustomInput } from "@/components/ui/kit/CustomInput";

import type {
  AdminSiteConfigPublicSectionProps,
  SiteConfigFormState,
} from "@/interfaces/page/admin/panel/IAdminSiteConfig";

const plainTextToHtml = (value: string): string => {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br />")}</p>`)
    .join("");
};

const stripHtml = (value: string): string => {
  return value
    .replace(/<h1[^>]*>/gi, "")
    .replace(/<\/h1>/gi, "\n\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const AdminSiteConfigPublicSection: FC<AdminSiteConfigPublicSectionProps> = ({
  form,
  fields,
  onChange,
}) => {
  const [htmlDraftValues, setHtmlDraftValues] = useState<
    Partial<Record<keyof SiteConfigFormState, string>>
  >({});

  useEffect(() => {
    const initialValues: Partial<Record<keyof SiteConfigFormState, string>> = {};

    fields.forEach((field) => {
      if (field.type === "html") {
        initialValues[field.key] = stripHtml(String(form[field.key] ?? ""));
      }
    });

    setHtmlDraftValues(initialValues);
  }, [fields, form.privacy_policy, form.terms_conditions]);

  const emitValue = (key: keyof SiteConfigFormState, value: string): void => {
    onChange(key)({
      target: { value },
    } as React.ChangeEvent<HTMLInputElement>);
  };

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
        {fields.map((field) => {
          const rawValue = String(form[field.key] ?? "");

          if (field.type === "html") {
            const textValue = htmlDraftValues[field.key] ?? "";

            return (
              <CustomInput
                key={field.key}
                label={field.label}
                placeholder={field.placeholder}
                value={textValue}
                onChange={(event) => {
                  const value = event.target.value;

                  setHtmlDraftValues((prev) => ({
                    ...prev,
                    [field.key]: value,
                  }));

                  emitValue(field.key, plainTextToHtml(value));
                }}
                type="text"
                multiline
                rows={8}
                fullWidth
              />
            );
          }

          return (
            <CustomInput
              key={field.key}
              label={field.label}
              placeholder={field.placeholder}
              value={rawValue}
              onChange={onChange(field.key)}
              type={field.type === "textarea" ? "text" : field.type ?? "text"}
              multiline={field.type === "textarea"}
              rows={field.type === "textarea" ? 4 : undefined}
              fullWidth
            />
          );
        })}
      </div>
    </div>
  );
};

export default AdminSiteConfigPublicSection;