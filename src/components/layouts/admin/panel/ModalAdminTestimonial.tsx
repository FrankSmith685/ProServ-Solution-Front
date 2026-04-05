/* eslint-disable react-hooks/set-state-in-effect */
import { type FC, useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  Save,
  Type,
  Image as ImageIcon,
  AlignLeft,
  Briefcase,
  Building2,
  Star,
} from "lucide-react";

import { CustomModal } from "@/components/ui/overlay/CustomModal";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomImageUploader } from "@/components/ui/kit/CustomImageUploader";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";
import { CustomImageViewer } from "@/components/ui/media/CustomImageViewer";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";

import type { TestimonialForm } from "@/interfaces/layouts/admin/panel/testimonials/ITestimonialSection";
import type {
  ModalAdminTestimonialProps,
  TestimonialModalTouchedState,
  TestimonialModalErrors,
} from "@/interfaces/layouts/admin/panel/testimonials/ITestimonialSection";

const INITIAL_TOUCHED: TestimonialModalTouchedState = {
  nombre: false,
  testimonio: false,
};

export const ModalAdminTestimonial: FC<ModalAdminTestimonialProps> = ({
  open,
  onClose,
  form,
  setForm,
  setFile,
  setImageUrl,
  onSave,
  loading = false,
  isEdit = false,
  initialImage,
  projects,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState<boolean>(false);
  const [touched, setTouched] =
    useState<TestimonialModalTouchedState>(INITIAL_TOUCHED);

  useEffect(() => {
    if (!open) return;

    setTouched(INITIAL_TOUCHED);
    setPreview(initialImage ?? null);
  }, [open, initialImage]);

  const handleChange =
    (key: keyof TestimonialForm) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;

      setForm((prev) => ({
        ...prev,
        [key]:
          key === "calificacion"
            ? Math.max(1, Math.min(5, Number(value) || 1))
            : value,
      }));

      if (key === "nombre" || key === "testimonio") {
        setTouched((prev) => ({
          ...prev,
          [key]: true,
        }));
      }
    };

  const handleImageChange = (url: string | null) => {
    setPreview(url);

    if (!url) {
      setImageUrl(null);
      setFile(null);
      return;
    }

    if (url.startsWith("blob:")) {
      return;
    }

    setImageUrl(url);
    setFile(null);
  };

  const handleUpload = async (file: File): Promise<string> => {
    setFile(file);
    setImageUrl(null);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return objectUrl;
  };

  const errors: TestimonialModalErrors = useMemo(
    () => ({
      nombre: touched.nombre && !form.nombre.trim(),
      testimonio: touched.testimonio && !form.testimonio.trim(),
    }),
    [form.nombre, form.testimonio, touched]
  );

  const isInvalid =
    !form.nombre.trim() ||
    !form.testimonio.trim() ||
    Number(form.calificacion ?? 0) < 1 ||
    Number(form.calificacion ?? 0) > 5;

  return (
    <>
      <CustomModal
        isOpen={open}
        onClose={onClose}
        title={isEdit ? "Editar Testimonio" : "Nuevo Testimonio"}
        width="min(920px, 96vw)"
        footer={
          <div className="flex w-full flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:justify-end sm:pt-4">
            <CustomButton
              text="Cancelar"
              variant="secondary"
              onClick={onClose}
              className="w-full! px-4! sm:w-auto!"
              fontSize="14px"
            />

            <CustomButton
              text={loading ? "Guardando..." : "Guardar"}
              icon={<Save size={16} />}
              onClick={onSave}
              loading={loading}
              disabled={isInvalid}
              className="w-full! gap-2! px-4! sm:w-auto!"
              fontSize="14px"
            />
          </div>
        }
      >
        <div className="space-y-5 px-0 py-1 sm:space-y-6">
          <div className="rounded-2xl border border-border bg-surface-soft p-4 sm:p-5">
            <div className="mb-4 space-y-1">
              <h4 className="text-sm font-semibold sm:text-base">
                Información del testimonio
              </h4>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Completa la información visible del cliente y su experiencia.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <CustomInput
                label="Nombre"
                value={form.nombre}
                onChange={handleChange("nombre")}
                error={errors.nombre}
                helperText={errors.nombre ? "Requerido" : ""}
                icon={<Type size={18} style={{ color: "var(--color-text-muted)" }} />}
                fullWidth
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CustomInput
                  label="Cargo"
                  value={form.cargo}
                  onChange={handleChange("cargo")}
                  icon={<Briefcase size={18} style={{ color: "var(--color-text-muted)" }} />}
                  fullWidth
                />

                <CustomInput
                  label="Empresa"
                  value={form.empresa}
                  onChange={handleChange("empresa")}
                  icon={<Building2 size={18} style={{ color: "var(--color-text-muted)" }} />}
                  fullWidth
                />
              </div>

              <CustomInput
                label="Testimonio"
                value={form.testimonio}
                onChange={handleChange("testimonio")}
                error={errors.testimonio}
                helperText={errors.testimonio ? "Requerido" : ""}
                multiline
                rows={5}
                icon={<AlignLeft size={18} style={{ color: "var(--color-text-muted)" }} />}
                fullWidth
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CustomInput
                  label="Calificación"
                  value={String(form.calificacion ?? 5)}
                  onChange={handleChange("calificacion")}
                  type="number"
                  icon={<Star size={18} style={{ color: "var(--color-text-muted)" }} />}
                  fullWidth
                />

                <CustomSelected
                  label="Proyecto relacionado"
                  value={form.proyecto_id}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      proyecto_id: String(e.target.value),
                    }))
                  }
                  options={[
                    { label: "Sin proyecto", value: "" },
                    ...projects.map((project) => ({
                      label: project.titulo,
                      value: project.id,
                    })),
                  ]}
                  fullWidth
                />
              </div>

              <div
                className={[
                  "rounded-2xl border p-4 transition-all",
                  form.activo
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-muted/20",
                ].join(" ")}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold sm:text-base">
                      Estado del testimonio
                    </h4>

                    <p className="text-xs text-muted-foreground sm:text-sm">
                      {form.activo
                        ? "Visible en el sitio web"
                        : "Oculto temporalmente"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3 py-2 sm:min-w-45 sm:justify-end">
                    <span
                      className={`text-xs font-semibold sm:text-sm ${
                        form.activo ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {form.activo ? "Activo" : "Inactivo"}
                    </span>

                    <CustomSwitch
                      checked={form.activo}
                      onChange={(_, checked: boolean) =>
                        setForm((prev) => ({
                          ...prev,
                          activo: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface-soft p-4 sm:p-5">
            <div className="mb-4 space-y-1">
              <div className="flex items-center gap-2">
                <ImageIcon
                  size={16}
                  style={{ color: "var(--color-text-muted)" }}
                />
                <h4 className="text-sm font-semibold sm:text-base">
                  Foto del cliente
                </h4>
              </div>

              <p className="text-xs text-muted-foreground sm:text-sm">
                Puedes agregar una foto opcional para mostrar el testimonio de forma más visual.
              </p>
            </div>

            <div className="space-y-3">
              <CustomImageUploader
                value={preview}
                onChange={handleImageChange}
                onUpload={handleUpload}
                onPreview={() => setViewerOpen(true)}
                label="Foto del testimonio"
              />
            </div>
          </div>
        </div>
      </CustomModal>

      <CustomImageViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        images={
          preview
            ? [
                {
                  src: preview,
                  alt: form.nombre || "Preview",
                },
              ]
            : []
        }
      />
    </>
  );
};