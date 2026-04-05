/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  Loader2,
  Edit2,
  Image as ImageIcon,
  LayoutPanelTop,
} from "lucide-react";

import { useHeroSlides } from "@/hooks/useHeroSlides";
import { ModalAdminHero } from "@/components/layouts/admin/panel/ModalAdminHero";
import { useAppState } from "@/hooks/useAppState";

import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomModalConfirm } from "@/components/ui/overlay/CustomModalConfirm";
import { CustomImageViewer } from "@/components/ui/media/CustomImageViewer";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";

import type {
  HeroSlideForm,
  HeroSlideUI,
  ViewerImageItem,
} from "@/interfaces/layouts/admin/panel/home/IHeroSlidesSection";

const INITIAL_FORM: HeroSlideForm = {
  titulo: "",
  subtitulo: "",
  badge: "",
  cta_texto: "Ver Servicios",
  cta_path: "/servicios",
  activo: true,
};

const HeroSlidesSection = () => {
  const {
    getHeroSlides,
    createSlide,
    updateSlide,
    deleteSlide,
    loading,
  } = useHeroSlides();

  const { heroSlide } = useAppState();
  const { showMessage } = useNotification();

  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState<HeroSlideForm>(INITIAL_FORM);

  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [initialImage, setInitialImage] = useState<string | null>(null);

  const [viewerImages, setViewerImages] = useState<ViewerImageItem[]>([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  useEffect(() => {
    getHeroSlides();
  }, []);

  const slides: HeroSlideUI[] = useMemo(() => {
    return (
      heroSlide
        ?.map((slide) => ({
          id: slide.id,
          titulo: slide.titulo ?? "",
          subtitulo: slide.subtitulo ?? "",
          badge: slide.badge ?? "",
          cta_texto: slide.cta_texto ?? "",
          cta_path: slide.cta_path ?? "",
          imagen_url: slide.media?.url ?? null,
          activo: Boolean(slide.activo),
          orden: slide.orden,
        }))
        .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)) ?? []
    );
  }, [heroSlide]);

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setFile(null);
    setImageUrl(null);
    setInitialImage(null);
    setEditingId(null);
  };

  const openNew = () => {
    resetForm();
    setModal(true);
  };

  const openEdit = (slide: HeroSlideUI) => {
    setEditingId(slide.id);

    setForm({
      id: slide.id,
      titulo: slide.titulo,
      subtitulo: slide.subtitulo,
      badge: slide.badge,
      cta_texto: slide.cta_texto,
      cta_path: slide.cta_path,
      activo: slide.activo,
      orden: slide.orden,
    });

    setInitialImage(slide.imagen_url ?? null);
    setImageUrl(null);
    setFile(null);
    setModal(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (editingId) {
        const hasNewFile = file !== null;
        const hasNewUrl = Boolean(imageUrl && imageUrl !== initialImage);

        await updateSlide(
          editingId,
          form,
          hasNewFile ? file : undefined,
          !hasNewFile && hasNewUrl ? imageUrl ?? undefined : undefined
        );

        showMessage("Slide actualizado correctamente", "success");
      } else {
        await createSlide(
          {
            ...form,
            orden: form.orden ?? (heroSlide?.length ?? 0) + 1,
          },
          file ?? undefined,
          file ? undefined : imageUrl ?? undefined
        );

        showMessage("Slide creado correctamente", "success");
      }

      setModal(false);
      resetForm();
    } catch (error) {
      console.error(error);
      showMessage("Ocurrió un error al guardar el slide", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      await deleteSlide(deleteId);
      showMessage("Slide eliminado correctamente", "success");
      setDeleteId(null);
    } catch (error) {
      console.error(error);
      showMessage("Error al eliminar el slide", "error");
    } finally {
      setDeleting(false);
    }
  };

  const openViewer = (selectedSlide: HeroSlideUI) => {
    const images: ViewerImageItem[] = slides
      .filter((slide) => slide.imagen_url)
      .map((slide) => ({
        src: slide.imagen_url as string,
        alt: slide.titulo,
      }));

    const selectedImageIndex = images.findIndex(
      (image) => image.src === selectedSlide.imagen_url
    );

    setViewerImages(images);
    setViewerIndex(selectedImageIndex >= 0 ? selectedImageIndex : 0);
    setViewerOpen(true);
  };

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
      <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-6 xl:col-span-4">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <LayoutPanelTop size={20} />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-primary sm:text-lg">
              Gestión del hero
            </h3>
            <p className="text-sm text-muted-foreground">
              Administra los slides visibles del banner principal.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface-soft p-4">
            <p className="text-sm font-semibold text-(--color-text)">
              Total registrados
            </p>
            <p className="mt-1 text-3xl font-black text-primary">
              {slides.length}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface-soft p-4">
            <p className="text-sm text-muted-foreground">
              Usa imágenes claras, badges y CTA bien definidos para mejorar el
              impacto visual del home.
            </p>
          </div>

          <CustomButton
            text="Nuevo slide"
            icon={<Plus size={16} />}
            onClick={openNew}
            size="md"
            fontSize="14px"
            variant="primary"
            className="w-full! justify-center gap-2!"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-6 xl:col-span-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <LayoutPanelTop size={20} />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-primary sm:text-lg">
              Listado de slides
            </h3>
            <p className="text-sm text-muted-foreground">
              Visualiza, edita y elimina los slides del hero.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-14">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="overflow-hidden rounded-2xl border border-border bg-surface-soft shadow-sm transition hover:shadow-md"
              >
                <button
                  type="button"
                  className="block w-full text-left"
                  onClick={() => {
                    if (!slide.imagen_url) return;
                    openViewer(slide);
                  }}
                >
                  {slide.imagen_url ? (
                    <img
                      src={slide.imagen_url}
                      alt={slide.titulo}
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-44 w-full items-center justify-center bg-muted/40 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <ImageIcon size={28} />
                        <span className="text-xs">Sin imagen</span>
                      </div>
                    </div>
                  )}
                </button>

                <div className="space-y-4 p-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          slide.activo
                            ? "bg-primary text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {slide.activo ? "Activo" : "Inactivo"}
                      </span>

                      {slide.badge && (
                        <span className="inline-flex items-center rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                          {slide.badge}
                        </span>
                      )}

                      {typeof slide.orden === "number" && (
                        <span className="ml-auto text-[11px] text-muted-foreground">
                          Orden: {slide.orden}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="line-clamp-2 text-sm font-semibold sm:text-base">
                        {slide.titulo || "Sin título"}
                      </h4>

                      <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        {slide.subtitulo || "Sin subtítulo"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <CustomButton
                      text="Editar"
                      icon={<Edit2 size={14} />}
                      size="sm"
                      variant="secondary"
                      fontSize="14px"
                      onClick={() => openEdit(slide)}
                      className="w-full! justify-center! gap-1! px-4!"
                    />

                    <CustomButton
                      text="Eliminar"
                      icon={<Trash2 size={14} />}
                      size="sm"
                      variant="error"
                      fontSize="14px"
                      onClick={() => setDeleteId(slide.id)}
                      className="w-full! justify-center! gap-1! px-4!"
                    />
                  </div>
                </div>
              </div>
            ))}

            {!slides.length && (
              <div className="col-span-full rounded-2xl border border-dashed border-border bg-surface-soft px-4 py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  No hay slides todavía. Crea el primero.
                </p>

                <div className="mt-4">
                  <CustomButton
                    text="Crear primer slide"
                    icon={<Plus size={16} />}
                    onClick={openNew}
                    size="md"
                    variant="primary"
                    className="w-full justify-center sm:w-auto"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ModalAdminHero
        open={modal}
        onClose={() => setModal(false)}
        form={form}
        setForm={setForm}
        setFile={setFile}
        setImageUrl={setImageUrl}
        onSave={handleSave}
        loading={saving}
        isEdit={Boolean(editingId)}
        initialImage={initialImage ?? undefined}
      />

      <CustomModalConfirm
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Eliminar slide"
        message="¿Seguro que deseas eliminar este slide? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

      <CustomImageViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        images={viewerImages}
        startIndex={viewerIndex}
      />
    </div>
  );
};

export default HeroSlidesSection;