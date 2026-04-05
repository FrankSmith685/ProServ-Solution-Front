/* eslint-disable react-hooks/set-state-in-effect */
import { type FC, useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  Save,
  Type,
  Image as ImageIcon,
  AlignLeft,
  Briefcase,
  Star,
  Tags,
} from "lucide-react";

import { CustomModal } from "@/components/ui/overlay/CustomModal";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";
import { CustomImageViewer } from "@/components/ui/media/CustomImageViewer";
import { CustomMultiImageUploader } from "@/components/ui/kit/CustomMultiImageUploader";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";

import type {
  ModalAdminProjectProps,
  ProjectModalErrors,
  ProjectModalTouchedState,
} from "@/interfaces/layouts/admin/panel/projects/IProjectSection";
import { CustomChip } from "@/components/ui/kit/CustomChip";

const INITIAL_TOUCHED: ProjectModalTouchedState = {
  titulo: false,
  servicio_id: false,
  categoria_id: false,
  imagenes: false,
};

type PreviewImageSource = "existing" | "url" | "file";

interface PreviewImageItem {
  url: string;
  source: PreviewImageSource;
}

export const ModalAdminProject: FC<ModalAdminProjectProps> = ({
  open,
  onClose,
  form,
  setForm,
  setFiles,
  setImageUrls,
  onSave,
  loading = false,
  isEdit = false,
  services,
  categories,
  tags,
}) => {
  const [previewItems, setPreviewItems] = useState<PreviewImageItem[]>([]);
  const [viewerOpen, setViewerOpen] = useState<boolean>(false);
  const [viewerStartIndex, setViewerStartIndex] = useState<number>(0);
  const [touched, setTouched] =
    useState<ProjectModalTouchedState>(INITIAL_TOUCHED);

  useEffect(() => {
    if (!open) return;

    setTouched(INITIAL_TOUCHED);

    const existingItems: PreviewImageItem[] = (form.images ?? [])
      .map((img) => img.media?.url)
      .filter(Boolean)
      .map((url) => ({
        url: url as string,
        source: "existing" as const,
      }));

    setPreviewItems(existingItems);
    setFiles([]);
    setImageUrls([]);
  }, [open, form.images, setFiles, setImageUrls]);

  const previewImages = useMemo(
    () => previewItems.map((item) => item.url),
    [previewItems]
  );

  const selectedTagIds = useMemo(
    () => new Set((form.tags ?? []).map((tag) => tag.id)),
    [form.tags]
  );

  const serviceOptions = useMemo(
    () =>
      services.map((service) => ({
        value: service.id,
        label: service.titulo,
      })),
    [services]
  );

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: category.id,
        label: category.nombre,
      })),
    [categories]
  );

  const handleChange =
    (key: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;

      setForm((prev) => ({
        ...prev,
        [key]: value,
      }));

      if (key === "titulo" || key === "servicio_id" || key === "categoria_id") {
        setTouched((prev) => ({
          ...prev,
          [key]: true,
        }));
      }
    };

const handleSelectChange =
  (key: "servicio_id" | "categoria_id") =>
  (
    e:
      | ChangeEvent<HTMLInputElement>
      | (Event & { target: { value: unknown; name: string } })
  ) => {
    const value = String(e.target.value ?? "");

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setTouched((prev) => ({
      ...prev,
      [key]: true,
    }));
  };
  const handleToggleTag = (tagId: string): void => {
    const found = tags.find((item) => item.id === tagId);
    if (!found) return;

    setForm((prev) => {
      const currentTags = prev.tags ?? [];
      const exists = currentTags.some((tag) => tag.id === tagId);

      return {
        ...prev,
        tags: exists
          ? currentTags.filter((tag) => tag.id !== tagId)
          : [
              ...currentTags,
              {
                id: found.id,
                nombre: found.nombre,
                slug: found.slug,
              },
            ],
      };
    });
  };

  const handleUploaderChange = (urls: string[]): void => {
    setPreviewItems((prev) => {
      const previousMap = new Map(prev.map((item) => [item.url, item]));

      return urls.map((url) => {
        const existing = previousMap.get(url);

        if (existing) return existing;

        const isLocalPreview = url.startsWith("blob:") || url.startsWith("data:");
        return {
          url,
          source: isLocalPreview ? "file" : "url",
        };
      });
    });

    setTouched((prev) => ({
      ...prev,
      imagenes: true,
    }));
  };

  const handleFilesSelected = (filesSelected: File[]): void => {
    setFiles((prev) => [...prev, ...filesSelected]);

    setTouched((prev) => ({
      ...prev,
      imagenes: true,
    }));
  };

  const handleAddUrl = (url: string): void => {
    setImageUrls((prev) => [...prev, url]);

    setTouched((prev) => ({
      ...prev,
      imagenes: true,
    }));
  };

  const handleRemoveImage = (index: number, url: string): void => {
    const removedItem = previewItems[index];
    if (!removedItem) return;

    if (removedItem.source === "existing") {
      setForm((prev) => ({
        ...prev,
        images: (prev.images ?? []).filter((img) => img.media?.url !== url),
      }));
    }

    if (removedItem.source === "url") {
      setImageUrls((prev) => prev.filter((itemUrl) => itemUrl !== url));
    }

    if (removedItem.source === "file") {
      const filePosition =
        previewItems
          .slice(0, index + 1)
          .filter((item) => item.source === "file").length - 1;

      setFiles((prev) => prev.filter((_, i) => i !== filePosition));
    }

    setPreviewItems((prev) => prev.filter((_, i) => i !== index));

    setTouched((prev) => ({
      ...prev,
      imagenes: true,
    }));
  };

  const errors: ProjectModalErrors = useMemo(
    () => ({
      titulo: touched.titulo && !form.titulo.trim(),
      servicio_id: touched.servicio_id && !form.servicio_id.trim(),
      categoria_id: touched.categoria_id && !form.categoria_id.trim(),
      imagenes: touched.imagenes && previewImages.length === 0,
    }),
    [form, touched, previewImages.length]
  );

  const isInvalid =
    !form.titulo.trim() ||
    !form.servicio_id.trim() ||
    !form.categoria_id.trim() ||
    previewImages.length === 0;

  return (
    <>
      <CustomModal
        isOpen={open}
        onClose={onClose}
        title={isEdit ? "Editar Proyecto" : "Nuevo Proyecto"}
        width="min(980px, 96vw)"
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
                Información del proyecto
              </h4>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Completa los datos principales del proyecto.
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
                label="Descripción"
                value={form.descripcion}
                onChange={handleChange("descripcion")}
                multiline
                rows={4}
                icon={
                  <AlignLeft
                    size={18}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                }
                fullWidth
              />

              <CustomInput
                label="Cliente"
                value={form.cliente}
                onChange={handleChange("cliente")}
                icon={
                  <Briefcase
                    size={18}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                }
                fullWidth
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CustomSelected
                  value={form.servicio_id}
                  onChange={handleSelectChange("servicio_id")}
                  options={serviceOptions}
                  label="Servicio"
                  placeholder="Selecciona un servicio"
                  error={errors.servicio_id}
                  helperText={errors.servicio_id ? "Requerido" : ""}
                  fullWidth
                  variant="primary"
                  size="lg"
                />

                <CustomSelected
                  value={form.categoria_id}
                  onChange={handleSelectChange("categoria_id")}
                  options={categoryOptions}
                  label="Categoría"
                  placeholder="Selecciona una categoría"
                  error={errors.categoria_id}
                  helperText={errors.categoria_id ? "Requerido" : ""}
                  fullWidth
                  variant="primary"
                  size="lg"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface-soft p-4 sm:p-5">
            <div className="mb-4 space-y-1">
              <div className="flex items-center gap-2">
                <Tags size={16} style={{ color: "var(--color-text-muted)" }} />
                <h4 className="text-sm font-semibold sm:text-base">Tags</h4>
              </div>

              <p className="text-xs text-muted-foreground sm:text-sm">
                Selecciona uno o varios tags para clasificar el proyecto.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map((tag) => {
                  const isSelected = selectedTagIds.has(tag.id);

                  return (
                    <CustomChip
                      key={tag.id}
                      label={`#${tag.nombre}`}
                      variant={isSelected ? "primary" : "primary-outline"}
                      selected={isSelected}
                      clickable
                      onClick={() => handleToggleTag(tag.id)}
                    />
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay tags registrados.
                </p>
              )}
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
                  Imágenes del proyecto
                </h4>
              </div>

              <p className="text-xs text-muted-foreground sm:text-sm">
                Puedes subir múltiples imágenes o agregar URLs.
              </p>
            </div>

            <div className="space-y-4">
              <CustomMultiImageUploader
                label="Galería del proyecto"
                value={previewImages}
                onChange={handleUploaderChange}
                onFilesSelected={handleFilesSelected}
                onAddUrl={handleAddUrl}
                onRemove={handleRemoveImage}
                onPreview={(index) => {
                  setViewerStartIndex(index);
                  setViewerOpen(true);
                }}
                maxImages={12}
                maxSizeMB={10}
                variant="primary"
              />

              {errors.imagenes && (
                <p className="text-xs text-red-500">
                  Debes agregar al menos una imagen
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div
              className={[
                "rounded-2xl border p-4 transition-all sm:p-5",
                form.destacado
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-muted/20",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-primary" />
                    <h4 className="text-sm font-semibold sm:text-base">
                      Proyecto destacado
                    </h4>
                  </div>

                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Mostrar como proyecto destacado
                  </p>
                </div>

                <CustomSwitch
                  checked={form.destacado}
                  onChange={(_, checked: boolean) =>
                    setForm((prev) => ({
                      ...prev,
                      destacado: checked,
                    }))
                  }
                />
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
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold sm:text-base">
                    Estado del proyecto
                  </h4>

                  <p className="text-xs text-muted-foreground sm:text-sm">
                    {form.activo
                      ? "Visible en el sitio web"
                      : "Oculto temporalmente"}
                  </p>
                </div>

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
        images={previewImages.map((src) => ({
          src,
          alt: form.titulo || "Preview",
        }))}
        startIndex={viewerStartIndex}
      />
    </>
  );
};