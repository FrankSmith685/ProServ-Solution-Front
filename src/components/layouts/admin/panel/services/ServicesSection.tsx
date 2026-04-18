/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  CheckCircle2,
  EyeOff,
  Plus,
  Trash2,
  Loader2,
  Edit2,
  Image as ImageIcon,
  Eye,
  Shapes,
} from "lucide-react";

import { useServices } from "@/hooks/useServices";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomTable } from "@/components/ui/kit/CustomTable";
import { CustomModalConfirm } from "@/components/ui/overlay/CustomModalConfirm";
import { CustomImageViewer } from "@/components/ui/media/CustomImageViewer";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";

import type {
  ServiceForm,
  ServiceUI,
  ViewerImageItem,
} from "@/interfaces/layouts/admin/panel/services/IServiceSection";

import { ModalAdminService } from "../ModalAdminService";
import { getServiceIconMeta } from "@/shared/design/serviceIcons";

const INITIAL_FORM: ServiceForm = {
  titulo: "",
  descripcion: "",
  descripcion_larga: "",
  icono: "",
  activo: true,
  orden: 0,
};

const TABLE_HEADERS: string[] = [
  "Imagen",
  "Servicio",
  "Ícono",
  "Orden",
  "Estado",
  "Acciones",
];

const actionBtnClass =
  "flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface transition-all duration-200 hover:bg-muted/60";

const actionBtnDangerClass =
  "flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/8 text-red-500 transition-all duration-200 hover:bg-red-500/15";

const ServicesSection = () => {
  const {
    services,
    getServices,
    createService,
    updateService,
    deleteService,
    loading,
  } = useServices();

  const { showMessage } = useNotification();

  const [modal, setModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  const [form, setForm] = useState<ServiceForm>(INITIAL_FORM);

  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [initialImage, setInitialImage] = useState<string | null>(null);

  const [viewerImages, setViewerImages] = useState<ViewerImageItem[]>([]);
  const [viewerOpen, setViewerOpen] = useState<boolean>(false);
  const [viewerIndex, setViewerIndex] = useState<number>(0);

  useEffect(() => {
    getServices();
  }, []);

  const rowsData: ServiceUI[] = useMemo(() => {
    return [...services]
      .map((service) => ({
        id: service.id,
        titulo: service.titulo ?? "",
        descripcion: service.descripcion ?? "",
        descripcion_larga: service.descripcion_larga ?? "",
        icono: service.icono ?? "",
        activo: Boolean(service.activo),
        orden: service.orden ?? 0,
        media_id: service.media_id ?? null,
        imagen_url: service.image_url ?? service.media?.url ?? null,
      }))
      .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
  }, [services]);

  const takenOrders = useMemo<number[]>(() => {
    return rowsData
      .filter((service) => service.id !== editingId)
      .map((service) => Number(service.orden ?? 0))
      .filter((order) => Number.isFinite(order) && order > 0);
  }, [rowsData, editingId]);

  const metrics = useMemo(() => {
    const active = rowsData.filter((item) => item.activo).length;
    const withImage = rowsData.filter((item) => Boolean(item.imagen_url)).length;

    return {
      active,
      inactive: rowsData.length - active,
      withImage,
    };
  }, [rowsData]);

  const resetForm = (): void => {
    setForm(INITIAL_FORM);
    setFile(null);
    setImageUrl(null);
    setInitialImage(null);
    setEditingId(null);
  };

  const openNew = (): void => {
    resetForm();

    const maxOrder = rowsData.length
      ? Math.max(...rowsData.map((item) => Number(item.orden ?? 0)))
      : 0;

    setForm({
      ...INITIAL_FORM,
      orden: maxOrder + 1,
    });

    setModal(true);
  };

  const openEdit = (service: ServiceUI): void => {
    setEditingId(service.id);

    setForm({
      id: service.id,
      titulo: service.titulo,
      descripcion: service.descripcion,
      descripcion_larga: service.descripcion_larga,
      icono: service.icono,
      activo: service.activo,
      orden: service.orden ?? 0,
    });

    setInitialImage(service.imagen_url ?? null);
    setImageUrl(null);
    setFile(null);
    setModal(true);
  };

  const handleSave = async (): Promise<void> => {
    const normalizedOrder = Number(form.orden ?? 0);

    if (!Number.isFinite(normalizedOrder) || normalizedOrder <= 0) {
      showMessage("El orden debe ser un número mayor a 0", "error");
      return;
    }

    if (takenOrders.includes(normalizedOrder)) {
      showMessage(
        `Ya existe un servicio con el orden ${normalizedOrder}. Usa otro número.`,
        "error"
      );
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        const hasNewFile = file !== null;
        const hasNewUrl = Boolean(imageUrl && imageUrl !== initialImage);

        await updateService(
          editingId,
          {
            ...form,
            orden: normalizedOrder,
          },
          hasNewFile ? file : undefined,
          !hasNewFile && hasNewUrl ? imageUrl ?? undefined : undefined
        );

        showMessage("Servicio actualizado correctamente", "success");
      } else {
        await createService(
          {
            ...form,
            orden: normalizedOrder,
          },
          file ?? undefined,
          file ? undefined : imageUrl ?? undefined
        );

        showMessage("Servicio creado correctamente", "success");
      }

      setModal(false);
      resetForm();
    } catch (error) {
      console.error(error);
      showMessage("Ocurrió un error al guardar el servicio", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      await deleteService(deleteId);
      showMessage("Servicio eliminado correctamente", "success");
      setDeleteId(null);
    } catch (error) {
      console.error(error);
      showMessage("Error al eliminar el servicio", "error");
    } finally {
      setDeleting(false);
    }
  };

  const openViewer = (selectedService: ServiceUI): void => {
    const images: ViewerImageItem[] = rowsData
      .filter((service) => service.imagen_url)
      .map((service) => ({
        src: service.imagen_url as string,
        alt: service.titulo,
      }));

    const selectedImageIndex = images.findIndex(
      (image) => image.src === selectedService.imagen_url
    );

    setViewerImages(images);
    setViewerIndex(selectedImageIndex >= 0 ? selectedImageIndex : 0);
    setViewerOpen(true);
  };

  const tableRows: ReactNode[][] = useMemo(() => {
    return rowsData.map((service) => {
      const iconMeta = getServiceIconMeta(service.icono);

      return [
        service.imagen_url ? (
          <button
            key={`${service.id}-image`}
            type="button"
            onClick={() => openViewer(service)}
            className="group flex items-center justify-center"
            aria-label={`Ver imagen de ${service.titulo || "servicio"}`}
          >
            <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/20 shadow-sm">
              <img
                src={service.imagen_url}
                alt={service.titulo}
                className="h-16 w-24 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </button>
        ) : (
          <div
            key={`${service.id}-image-empty`}
            className="flex h-16 w-24 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 text-muted-foreground"
          >
            <ImageIcon size={18} />
          </div>
        ),

        <div className="min-w-56 max-w-80" key={`${service.id}-service`}>
          <div className="space-y-2">
            <p className="line-clamp-2 text-sm font-semibold leading-5 text-(--color-text) sm:text-[15px]">
              {service.titulo || "Sin título"}
            </p>

            <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
              {service.descripcion || "Sin descripción"}
            </p>
          </div>
        </div>,

        <div className="min-w-44" key={`${service.id}-icon`}>
          {iconMeta ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-xs font-medium text-(--color-text)">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                {iconMeta.icon}
              </span>
              {iconMeta.label}
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
              <Shapes size={14} />
              Sin ícono
            </span>
          )}
        </div>,

        <div className="min-w-24" key={`${service.id}-order`}>
          <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-primary/10 px-2 text-sm font-semibold text-primary">
            {service.orden ?? 0}
          </span>
        </div>,

        <div className="min-w-28" key={`${service.id}-status`}>
          <span
            className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide ${
              service.activo
                ? "bg-primary text-white shadow-sm"
                : "bg-muted/70 text-muted-foreground"
            }`}
          >
            {service.activo ? "Activo" : "Inactivo"}
          </span>
        </div>,

        <div
          className="flex min-w-32 items-center gap-2"
          key={`${service.id}-actions`}
        >
          <button
            type="button"
            aria-label="Ver imagen"
            onClick={() => {
              if (service.imagen_url) openViewer(service);
            }}
            className={actionBtnClass}
          >
            <Eye size={15} />
          </button>

          <button
            type="button"
            aria-label="Editar servicio"
            onClick={() => openEdit(service)}
            className={actionBtnClass}
          >
            <Edit2 size={15} />
          </button>

          <button
            type="button"
            aria-label="Eliminar servicio"
            onClick={() => setDeleteId(service.id)}
            className={actionBtnDangerClass}
          >
            <Trash2 size={15} />
          </button>
        </div>,
      ];
    });
  }, [rowsData]);

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
      <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-6 xl:col-span-4">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Shapes size={20} />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-primary sm:text-lg">
              Gestión de servicios
            </h3>
            <p className="text-sm text-muted-foreground">
              Administra los servicios visibles del sitio.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface-soft p-4">
            <p className="text-sm font-semibold text-(--color-text)">
              Total registrados
            </p>
            <p className="mt-1 text-3xl font-black text-primary">
              {rowsData.length}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                <CheckCircle2 size={14} />
                Activos
              </p>
              <p className="mt-2 text-2xl font-black text-dark">{metrics.active}</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface-soft p-4">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                <EyeOff size={14} />
                Inactivos
              </p>
              <p className="mt-2 text-2xl font-black text-dark">{metrics.inactive}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface-soft p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Con imagen cargada
            </p>
            <p className="mt-2 text-2xl font-black text-dark">{metrics.withImage}</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface-soft p-4">
            <p className="text-sm text-muted-foreground">
              Usa imagen + ícono para que cada servicio tenga mejor identidad visual.
            </p>
          </div>

          <CustomButton
            text="Nuevo servicio"
            icon={<Plus size={16} />}
            onClick={openNew}
            variant="primary"
            size="md"
            fontSize="14px"
            className="w-full! justify-center gap-2!"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-6 xl:col-span-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Shapes size={20} />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-primary sm:text-lg">
              Listado de servicios
            </h3>
            <p className="text-sm text-muted-foreground">
              Visualiza, edita y elimina servicios registrados.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-14">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-soft">
            <CustomTable
              headers={TABLE_HEADERS}
              data={tableRows}
              loading={loading}
              rows={6}
              columns={TABLE_HEADERS.length}
              emptyText="No hay servicios registrados"
              columnWidths={[
                "130px",
                "320px",
                "220px",
                "100px",
                "130px",
                "140px",
              ]}
              minWidth={1040}
              maxHeight={560}
            />
          </div>
        )}
      </div>

      <ModalAdminService
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
        takenOrders={takenOrders}
      />

      <CustomModalConfirm
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Eliminar servicio"
        message="¿Seguro que deseas eliminar este servicio? Esta acción no se puede deshacer."
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

export default ServicesSection;
