/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Search,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Eye,
  FolderOpen,
  FileImage,
  Images,
  RefreshCw,
} from "lucide-react";

import { useMedia } from "@/hooks/useMedia";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomTable } from "@/components/ui/kit/CustomTable";
import { CustomModalConfirm } from "@/components/ui/overlay/CustomModalConfirm";
import { CustomImageViewer } from "@/components/ui/media/CustomImageViewer";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";

import type { Media } from "@/interfaces/hook/IUseMedia";

const TABLE_HEADERS: string[] = [
  "Preview",
  "Archivo",
  "Carpeta",
  "Tipo",
  "Tamaño",
  "Fecha",
  "Acciones",
];

const actionBtnClass =
  "flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-(--color-text) transition-all duration-200 hover:bg-muted/60";

const actionBtnDangerClass =
  "flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/8 text-red-500 transition-all duration-200 hover:bg-red-500/15";

const FOLDER_OPTIONS = [
  { value: "", label: "Todas" },
  { value: "general", label: "General" },
  { value: "service", label: "Servicios" },
  { value: "project", label: "Proyectos" },
  { value: "hero_slide", label: "Hero Slide" },
  { value: "nosotros", label: "Nosotros" },
  { value: "testimonial", label: "Testimonios" },
  { value: "external", label: "Externas" },
];

const formatBytes = (bytes?: number): string => {
  if (!bytes || bytes <= 0) return "—";

  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

const formatDate = (value?: string): string => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const getFileName = (media: Media): string => {
  const source = media.path || media.url || "";
  const segments = source.split("/");
  return segments[segments.length - 1] || "archivo";
};

const MediaSection = () => {
  const { getAllMedia, deleteMedia, loading } = useMedia();
  const { showMessage } = useNotification();

  const [items, setItems] = useState<Media[]>([]);
  const [search, setSearch] = useState<string>("");
  const [folder, setFolder] = useState<string>("");
  const [fetching, setFetching] = useState<boolean>(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  const [viewerImages, setViewerImages] = useState<{ src: string; alt?: string }[]>([]);
  const [viewerOpen, setViewerOpen] = useState<boolean>(false);
  const [viewerIndex, setViewerIndex] = useState<number>(0);

  const loadMedia = async (): Promise<void> => {
    try {
      setFetching(true);

      const data = await getAllMedia({
        search: search.trim() || undefined,
        folder: folder || undefined,
      });

      setItems(data);
    } catch (error) {
      console.error(error);
      showMessage("No se pudo cargar la biblioteca multimedia", "error");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleSearch = async (): Promise<void> => {
    await loadMedia();
  };

  const handleRefresh = async (): Promise<void> => {
    await loadMedia();
    showMessage("Listado actualizado", "success");
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!deleteId) return;

    try {
      setDeleting(true);

      const ok = await deleteMedia(deleteId, ({ success, message }) => {
        showMessage(message ?? "", success ? "success" : "error");
      });

      if (!ok) return;

      setDeleteId(null);
      await loadMedia();
    } catch (error) {
      console.error(error);
      showMessage("Error al eliminar el archivo", "error");
    } finally {
      setDeleting(false);
    }
  };

  const openViewer = (selectedMedia: Media): void => {
    const images = items
      .filter((item) => item.tipo?.startsWith("image/") && item.url)
      .map((item) => ({
        src: item.url,
        alt: getFileName(item),
      }));

    const selectedIndex = images.findIndex((img) => img.src === selectedMedia.url);

    setViewerImages(images);
    setViewerIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setViewerOpen(true);
  };

  const stats = useMemo(() => {
    const images = items.filter((item) => item.tipo?.startsWith("image/")).length;
    const totalSize = items.reduce((sum, item) => sum + Number(item.tamaño || 0), 0);

    return {
      total: items.length,
      images,
      totalSize,
    };
  }, [items]);

  const tableRows: ReactNode[][] = useMemo(() => {
    return items.map((media) => {
      const isImage = media.tipo?.startsWith("image/");
      const fileName = getFileName(media);

      return [
        isImage ? (
          <button
            key={`${media.id}-preview`}
            type="button"
            onClick={() => openViewer(media)}
            className="group flex items-center justify-center"
            aria-label={`Ver ${fileName}`}
          >
            <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/20 shadow-sm">
              <img
                src={media.url}
                alt={fileName}
                className="h-16 w-24 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </button>
        ) : (
          <div
            key={`${media.id}-preview-empty`}
            className="flex h-16 w-24 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 text-muted-foreground"
          >
            <FileImage size={18} />
          </div>
        ),

        <div className="min-w-56 max-w-80" key={`${media.id}-file`}>
          <div className="space-y-2">
            <p className="line-clamp-2 text-sm font-semibold leading-5 text-(--color-text)">
              {fileName}
            </p>

            <p className="line-clamp-1 text-xs text-muted-foreground">
              ID: {media.id}
            </p>
          </div>
        </div>,

        <div className="min-w-32" key={`${media.id}-folder`}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-xs font-medium text-(--color-text)">
            <FolderOpen size={14} />
            {media.folder || "general"}
          </span>
        </div>,

        <div className="min-w-40" key={`${media.id}-type`}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-xs font-medium text-(--color-text)">
            <ImageIcon size={14} />
            {media.tipo || "—"}
          </span>
        </div>,

        <div className="min-w-28" key={`${media.id}-size`}>
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            {formatBytes(media.tamaño)}
          </span>
        </div>,

        <div className="min-w-28" key={`${media.id}-date`}>
          <span className="text-sm text-muted-foreground">
            {formatDate(media.created_at)}
          </span>
        </div>,

        <div className="flex min-w-24 items-center gap-2" key={`${media.id}-actions`}>
          <button
            type="button"
            aria-label="Ver archivo"
            onClick={() => {
              if (isImage) openViewer(media);
            }}
            className={actionBtnClass}
          >
            <Eye size={15} />
          </button>

          <button
            type="button"
            aria-label="Eliminar archivo"
            onClick={() => setDeleteId(media.id)}
            className={actionBtnDangerClass}
          >
            <Trash2 size={15} />
          </button>
        </div>,
      ];
    });
  }, [items]);

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
      <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-6 xl:col-span-4">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Images size={20} />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-primary sm:text-lg">
              Gestión de medias
            </h3>
            <p className="text-sm text-muted-foreground">
              Administra archivos subidos al sistema.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface-soft p-4">
            <p className="text-sm font-semibold text-(--color-text)">
              Total registrados
            </p>
            <p className="mt-1 text-3xl font-black text-primary">
              {stats.total}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface-soft p-4">
            <p className="text-sm font-semibold text-(--color-text)">
              Imágenes
            </p>
            <p className="mt-1 text-3xl font-black text-primary">
              {stats.images}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface-soft p-4">
            <p className="text-sm font-semibold text-(--color-text)">
              Peso total
            </p>
            <p className="mt-1 text-2xl font-black text-primary">
              {formatBytes(stats.totalSize)}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface-soft p-4">
            <p className="mb-3 text-sm font-semibold text-(--color-text)">
              Filtros
            </p>

            <div className="space-y-3">
              <CustomInput
                label="Buscar"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre o tipo"
                icon={<Search size={16} style={{ color: "var(--color-text-muted)" }} />}
                fullWidth
              />

              <CustomSelected
                label="Carpeta"
                placeholder="Seleccione una carpeta"
                value={folder}
                onChange={(event) => {
                  const selectedValue = String(event.target.value ?? "");
                  setFolder(selectedValue);
                }}
                options={FOLDER_OPTIONS}
                fullWidth
                variant="primary"
                size="lg"
              />

              <div className="flex gap-2">
                <CustomButton
                  text="Filtrar"
                  icon={<Search size={16} />}
                  onClick={handleSearch}
                  variant="primary"
                  size="sm"
                  fontSize="12px"
                  className="flex-1! justify-center px-4! gap-2!"
                />

                <CustomButton
                  text="Recargar"
                  icon={<RefreshCw size={16} />}
                  onClick={handleRefresh}
                  variant="secondary-outline"
                  size="sm"
                  fontSize="12px"
                  className="flex-1! justify-center! px-4! gap-1!"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-6 xl:col-span-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Images size={20} />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-primary sm:text-lg">
              Biblioteca multimedia
            </h3>
            <p className="text-sm text-muted-foreground">
              Visualiza, filtra y elimina archivos multimedia registrados.
            </p>
          </div>
        </div>

        {loading || fetching ? (
          <div className="flex justify-center py-14">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-soft">
            <CustomTable
              headers={TABLE_HEADERS}
              data={tableRows}
              loading={loading || fetching}
              rows={6}
              columns={TABLE_HEADERS.length}
              emptyText="No hay archivos registrados"
              columnWidths={[
                "130px",
                "320px",
                "150px",
                "220px",
                "120px",
                "120px",
                "110px",
              ]}
              minWidth={1120}
              maxHeight={560}
            />
          </div>
        )}
      </div>

      <CustomModalConfirm
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Eliminar archivo"
        message="¿Seguro que deseas eliminar este archivo? Solo se eliminará si no está siendo usado en el sistema."
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

export default MediaSection;