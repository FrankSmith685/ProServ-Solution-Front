/* eslint-disable react-hooks/set-state-in-effect */
import { type FC, useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  Save,
  Type,
  Image as ImageIcon,
  AlignLeft,
  Hash,
  Shapes,
  Check,
} from "lucide-react";

import { CustomModal } from "@/components/ui/overlay/CustomModal";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomImageUploader } from "@/components/ui/kit/CustomImageUploader";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";
import { CustomImageViewer } from "@/components/ui/media/CustomImageViewer";

import type { ServiceForm } from "@/interfaces/layouts/admin/panel/services/IServiceSection";
import type {
  ModalAdminServiceProps,
  ServiceModalTouchedState,
  ServiceModalErrors,
} from "@/interfaces/layouts/admin/panel/IModalAdminService";

import {
  SERVICE_ICONS,
  getServiceIconMeta,
} from "@/shared/design/serviceIcons";

const INITIAL_TOUCHED: ServiceModalTouchedState = {
  titulo: false,
  imagen: false,
  orden: false,
};

export const ModalAdminService: FC<ModalAdminServiceProps> = ({
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
  takenOrders = [],
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState<boolean>(false);
  const [touched, setTouched] =
    useState<ServiceModalTouchedState>(INITIAL_TOUCHED);

  useEffect(() => {
    if (!open) return;

    setTouched(INITIAL_TOUCHED);
    setPreview(initialImage ?? null);
  }, [open, initialImage]);

  const handleChange =
    (key: keyof ServiceForm) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const rawValue = e.target.value;

      setForm((prev) => ({
        ...prev,
        [key]:
          key === "orden"
            ? rawValue === ""
              ? 0
              : Number(rawValue)
            : rawValue,
      }));

      if (key === "titulo" || key === "orden") {
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

  const normalizedOrder = Number(form.orden ?? 0);
  const orderIsEmptyOrInvalid =
    !Number.isFinite(normalizedOrder) || normalizedOrder <= 0;
  const orderIsDuplicated =
    !orderIsEmptyOrInvalid && takenOrders.includes(normalizedOrder);

  const errors: ServiceModalErrors = useMemo(
    () => ({
      titulo: touched.titulo && !form.titulo.trim(),
      imagen: touched.imagen && !preview,
      orden: touched.orden && (orderIsEmptyOrInvalid || orderIsDuplicated),
    }),
    [
      form.titulo,
      touched,
      preview,
      orderIsEmptyOrInvalid,
      orderIsDuplicated,
    ]
  );

  const isInvalid =
    !form.titulo.trim() ||
    !preview ||
    orderIsEmptyOrInvalid ||
    orderIsDuplicated;

  const selectedIcon = getServiceIconMeta(form.icono);

  return (
    <>
      <CustomModal
        isOpen={open}
        onClose={onClose}
        title={isEdit ? "Editar Servicio" : "Nuevo Servicio"}
        width="min(920px, 96vw)"
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
              icon={<Save size={16} />}
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
                Información del servicio
              </h4>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Completa los datos visibles del servicio.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <CustomInput
                label="Título"
                value={form.titulo}
                onChange={handleChange("titulo")}
                error={errors.titulo}
                helperText={errors.titulo ? "Requerido" : ""}
                icon={<Type size={18} style={{ color: "var(--color-text-muted)" }} />}
                fullWidth
              />

              <CustomInput
                label="Descripción corta"
                value={form.descripcion}
                onChange={handleChange("descripcion")}
                multiline
                rows={3}
                icon={<AlignLeft size={18} style={{ color: "var(--color-text-muted)" }} />}
                fullWidth
              />

              <CustomInput
                label="Descripción larga"
                value={form.descripcion_larga}
                onChange={handleChange("descripcion_larga")}
                multiline
                rows={5}
                fullWidth
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-surface p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Shapes size={17} style={{ color: "var(--color-text-muted)" }} />
                    <h5 className="text-sm font-semibold">Ícono del servicio</h5>
                  </div>

                  <p className="mb-4 text-xs text-muted-foreground">
                    Selecciona un ícono para identificar el servicio en cards, listados o secciones destacadas.
                  </p>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {SERVICE_ICONS.map((item) => {
                      const active = form.icono === item.key;

                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              icono: item.key,
                            }))
                          }
                          className={[
                            "relative flex flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-4 text-center transition-all duration-200",
                            active
                              ? "border-primary bg-primary/10 text-primary shadow-sm"
                              : "border-border bg-surface hover:bg-muted/30",
                          ].join(" ")}
                        >
                          {active && (
                            <span className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                              <Check size={12} />
                            </span>
                          )}

                          <span>{item.icon}</span>
                          <span className="text-[11px] font-medium leading-4">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 rounded-xl border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                    Seleccionado:{" "}
                    <span className="font-semibold text-(--color-text)">
                      {selectedIcon?.label ?? "Ninguno"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <CustomInput
                    label="Orden"
                    value={String(form.orden ?? 0)}
                    onChange={handleChange("orden")}
                    type="number"
                    error={errors.orden}
                    helperText={
                      errors.orden
                        ? orderIsDuplicated
                          ? `El orden ${normalizedOrder} ya está en uso`
                          : "El orden debe ser mayor a 0"
                        : "Debe ser único"
                    }
                    icon={<Hash size={18} style={{ color: "var(--color-text-muted)" }} />}
                    fullWidth
                  />

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
                          Estado del servicio
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
                  Imagen del servicio
                </h4>
              </div>

              <p className="text-xs text-muted-foreground sm:text-sm">
                La imagen sigue siendo la principal. El ícono funciona como apoyo visual.
              </p>
            </div>

            <div className="space-y-3">
              <CustomImageUploader
                value={preview}
                onChange={handleImageChange}
                onUpload={handleUpload}
                onPreview={() => setViewerOpen(true)}
                label="Imagen del servicio"
              />

              {errors.imagen && (
                <p className="text-xs text-red-500">
                  La imagen es obligatoria
                </p>
              )}
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