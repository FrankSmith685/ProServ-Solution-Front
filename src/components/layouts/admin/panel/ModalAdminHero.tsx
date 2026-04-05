/* eslint-disable react-hooks/set-state-in-effect */

import { type FC, useMemo, useState, useEffect, type ChangeEvent } from "react";
import { Save, Link as LinkIcon, Type, Tag, ImageIcon } from "lucide-react";

import { CustomModal } from "@/components/ui/overlay/CustomModal";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomImageUploader } from "@/components/ui/kit/CustomImageUploader";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";
import { CustomImageViewer } from "@/components/ui/media/CustomImageViewer";

import type { HeroSlideForm } from "@/interfaces/layouts/admin/panel/home/IHeroSlidesSection";
import type {
  ModalAdminHeroProps,
  HeroModalTouchedState,
  HeroModalErrors,
} from "@/interfaces/layouts/admin/panel/IModalAdminHero";

const INITIAL_TOUCHED: HeroModalTouchedState = {
  titulo: false,
  imagen: false,
};

export const ModalAdminHero: FC<ModalAdminHeroProps> = ({
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
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [touched, setTouched] =
    useState<HeroModalTouchedState>(INITIAL_TOUCHED);

  useEffect(() => {
    if (!open) return;

    setTouched(INITIAL_TOUCHED);
    setPreview(initialImage ?? null);
  }, [open, initialImage]);

  useEffect(() => {
    if (initialImage && !preview) {
      setPreview(initialImage);
    }
  }, [initialImage, preview]);

  const handleChange =
    (key: keyof HeroSlideForm) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setForm((prev) => ({
        ...prev,
        [key]: value,
      }));

      if (key === "titulo") {
        setTouched((prev) => ({
          ...prev,
          titulo: true,
        }));
      }
    };

  const handleImageChange = (url: string | null) => {
    setPreview(url);

    if (!url) {
      setImageUrl(null);
      setFile(null);

      setTouched((prev) => ({
        ...prev,
        imagen: true,
      }));
      return;
    }

    if (url.startsWith("blob:")) {
      setTouched((prev) => ({
        ...prev,
        imagen: true,
      }));
      return;
    }

    setImageUrl(url);
    setFile(null);

    setTouched((prev) => ({
      ...prev,
      imagen: true,
    }));
  };

  const handleUpload = async (file: File): Promise<string> => {
    setFile(file);
    setImageUrl(null);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    setTouched((prev) => ({
      ...prev,
      imagen: true,
    }));

    return objectUrl;
  };

  const errors: HeroModalErrors = useMemo(
    () => ({
      titulo: touched.titulo && !form.titulo.trim(),
      imagen: touched.imagen && !preview,
    }),
    [form.titulo, touched, preview]
  );

  const isInvalid = !form.titulo.trim() || !preview;

  return (
    <>
      <CustomModal
        isOpen={open}
        onClose={onClose}
        title={isEdit ? "Editar Slide" : "Nuevo Slide"}
        width="min(760px, 96vw)"
        footer={
          <div className="flex w-full flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:justify-end sm:pt-4">
            <CustomButton
              text="Cancelar"
              variant="secondary"
              onClick={onClose}
              className="w-full! sm:w-auto! px-4!"
              fontSize="14px"
            />

            <CustomButton
              text={loading ? "Guardando..." : "Guardar"}
              icon={<Save size={16} style={{ color: "var(--color-on-dark)" }} />}
              onClick={onSave}
              loading={loading}
              disabled={isInvalid}
              className="w-full! sm:w-auto! px-4! gap-2!"
              fontSize="14px"
            />
          </div>
        }
      >
        <div className="space-y-5 px-0 py-1 sm:space-y-6">
          <div className="rounded-2xl border border-border bg-surface-soft p-4 sm:p-5">
            <div className="mb-4 space-y-1">
              <h4 className="text-sm font-semibold sm:text-base">
                Contenido principal
              </h4>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Completa la información visible del slide.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <CustomInput
                label="Título"
                value={form.titulo}
                onChange={handleChange("titulo")}
                error={errors.titulo}
                helperText={errors.titulo ? "Requerido" : ""}
                icon={
                  <Type size={18} style={{ color: "var(--color-text-muted)" }} />
                }
                fullWidth
              />

              <CustomInput
                label="Subtítulo"
                value={form.subtitulo}
                onChange={handleChange("subtitulo")}
                multiline
                rows={3}
                fullWidth
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CustomInput
                  label="Badge"
                  value={form.badge}
                  onChange={handleChange("badge")}
                  icon={
                    <Tag size={18} style={{ color: "var(--color-text-muted)" }} />
                  }
                  fullWidth
                />

                <CustomInput
                  label="Texto botón"
                  value={form.cta_texto}
                  onChange={handleChange("cta_texto")}
                  fullWidth
                />
              </div>

              <CustomInput
                label="Ruta botón"
                value={form.cta_path}
                onChange={handleChange("cta_path")}
                icon={
                  <LinkIcon
                    size={18}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                }
                fullWidth
              />
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
                  Imagen del slide
                </h4>
              </div>

              <p className="text-xs text-muted-foreground sm:text-sm">
                Sube una imagen o selecciona una URL para el slide principal.
              </p>
            </div>

            <div className="space-y-3">
              <CustomImageUploader
                value={preview}
                onChange={handleImageChange}
                onUpload={handleUpload}
                onPreview={() => setViewerOpen(true)}
                label="Imagen del slide"
              />

              {errors.imagen && (
                <p className="text-xs text-red-500">
                  La imagen es obligatoria
                </p>
              )}
            </div>
          </div>

          <div
            className={[
              "rounded-2xl border p-4 transition-all sm:p-5",
              form.activo
                ? "border-primary/30 bg-primary/5"
                : "border-border bg-muted/20",
            ].join(" ")}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold sm:text-base">
                  Estado del slide
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
      </CustomModal>

      <CustomImageViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        images={
          preview
            ? [
                {
                  src: preview,
                  alt: form.titulo || "Preview",
                },
              ]
            : []
        }
      />
    </>
  );
};