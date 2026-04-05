/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Plus,
  Trash2,
  Loader2,
  Edit2,
  Image as ImageIcon,
  Star,
  Building2,
  Briefcase,
  FolderKanban,
} from "lucide-react";

import { useTestimonials } from "@/hooks/useTestimonials";
import { useProjects } from "@/hooks/useProjects";

import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomTable } from "@/components/ui/kit/CustomTable";
import { CustomModalConfirm } from "@/components/ui/overlay/CustomModalConfirm";
import { CustomImageViewer } from "@/components/ui/media/CustomImageViewer";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";

import type {
  TestimonialForm,
  TestimonialUI,
} from "@/interfaces/layouts/admin/panel/testimonials/ITestimonialSection";
import { ModalAdminTestimonial } from "../ModalAdminTestimonial";

const INITIAL_FORM: TestimonialForm = {
  nombre: "",
  cargo: "",
  empresa: "",
  testimonio: "",
  foto_media_id: null,
  calificacion: 5,
  proyecto_id: "",
  activo: true,
};

const TABLE_HEADERS: string[] = [
  "Foto",
  "Cliente",
  "Empresa / Cargo",
  "Proyecto",
  "Calificación",
  "Estado",
  "Acciones",
];

const actionBtnClass =
  "flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface transition-all duration-200 hover:bg-muted/60";

const actionBtnDangerClass =
  "flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/8 text-red-500 transition-all duration-200 hover:bg-red-500/15";

const softBadgeClass =
  "inline-flex items-center gap-1 rounded-full border border-border bg-muted/30 px-3 py-1 text-[11px] font-medium text-(--color-text)";

const TestimonialsSection = () => {
  const {
    testimonials,
    getAdminTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    loading: loadingTestimonials,
  } = useTestimonials();

  const { projects, getProjects, loading: loadingProjects } = useProjects();
  const { showMessage } = useNotification();

  const [modal, setModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  const [form, setForm] = useState<TestimonialForm>(INITIAL_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [viewerImages, setViewerImages] = useState<{ src: string; alt?: string }[]>([]);
  const [viewerOpen, setViewerOpen] = useState<boolean>(false);

  useEffect(() => {
    void getAdminTestimonials();
    void getProjects();
  }, []);

  const rowsData: TestimonialUI[] = useMemo(() => {
    return [...testimonials].map((testimonial) => ({
      ...testimonial,
      photo_url: testimonial.photo?.url ?? null,
      project_name: testimonial.project?.titulo ?? "-",
    }));
  }, [testimonials]);

  const resetForm = (): void => {
    setForm(INITIAL_FORM);
    setFile(null);
    setImageUrl(null);
    setEditingId(null);
  };

  const openNew = (): void => {
    resetForm();
    setModal(true);
  };

  const openEdit = (testimonial: TestimonialUI): void => {
    setEditingId(testimonial.id);

    setForm({
      id: testimonial.id,
      nombre: testimonial.nombre ?? "",
      cargo: testimonial.cargo ?? "",
      empresa: testimonial.empresa ?? "",
      testimonio: testimonial.testimonio ?? "",
      foto_media_id: testimonial.foto_media_id ?? null,
      calificacion: testimonial.calificacion ?? 5,
      proyecto_id: testimonial.proyecto_id ?? "",
      activo: Boolean(testimonial.activo),
    });

    setFile(null);
    setImageUrl(testimonial.photo?.url ?? null);
    setModal(true);
  };

  const handleSave = async (): Promise<void> => {
    if (!form.nombre.trim() || !form.testimonio.trim()) {
      showMessage("Completa los campos requeridos", "error");
      return;
    }

    setSaving(true);

    if (editingId) {
      await updateTestimonial(
        editingId,
        form,
        file ?? undefined,
        imageUrl ?? undefined,
        ({ success, message }) => {
          if (success) {
            showMessage(message || "Testimonio actualizado correctamente", "success");
            setModal(false);
            resetForm();
          } else {
            showMessage(
              message || "Ocurrió un error al actualizar el testimonio",
              "error"
            );
          }
        }
      );
    } else {
      await createTestimonial(
        form,
        file ?? undefined,
        imageUrl ?? undefined,
        ({ success, message }) => {
          if (success) {
            showMessage(message || "Testimonio creado correctamente", "success");
            setModal(false);
            resetForm();
          } else {
            showMessage(
              message || "Ocurrió un error al crear el testimonio",
              "error"
            );
          }
        }
      );
    }

    setSaving(false);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!deleteId) return;

    setDeleting(true);

    await deleteTestimonial(deleteId, ({ success, message }) => {
      if (success) {
        showMessage(message || "Testimonio eliminado correctamente", "success");
        setDeleteId(null);
      } else {
        showMessage(message || "Error al eliminar el testimonio", "error");
      }
    });

    setDeleting(false);
  };

  const openViewer = (testimonial: TestimonialUI): void => {
    if (!testimonial.photo_url) return;

    setViewerImages([
      {
        src: testimonial.photo_url,
        alt: testimonial.nombre,
      },
    ]);
    setViewerOpen(true);
  };

  const tableRows: ReactNode[][] = useMemo(() => {
    return rowsData.map((testimonial) => [
      testimonial.photo_url ? (
        <button
          key={`${testimonial.id}-image`}
          type="button"
          onClick={() => openViewer(testimonial)}
          className="group flex items-center justify-center"
          aria-label={`Ver foto de ${testimonial.nombre || "cliente"}`}
        >
          <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/20 shadow-sm">
            <img
              src={testimonial.photo_url}
              alt={testimonial.nombre}
              className="h-16 w-16 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </button>
      ) : (
        <div
          key={`${testimonial.id}-image-empty`}
          className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 text-muted-foreground"
        >
          <ImageIcon size={18} />
        </div>
      ),

      <div className="min-w-56 max-w-72" key={`${testimonial.id}-client`}>
        <div className="space-y-2">
          <p className="line-clamp-2 text-sm font-semibold leading-5 text-(--color-text) sm:text-[15px]">
            {testimonial.nombre || "Sin nombre"}
          </p>

          <p className="line-clamp-3 text-xs leading-5 text-muted-foreground">
            {testimonial.testimonio || "-"}
          </p>
        </div>
      </div>,

      <div className="min-w-48 max-w-56" key={`${testimonial.id}-company`}>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Building2 size={13} />
            {testimonial.empresa || "-"}
          </div>

          <div className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Briefcase size={13} />
            {testimonial.cargo || "-"}
          </div>
        </div>
      </div>,

      <div className="min-w-44" key={`${testimonial.id}-project`}>
        <span className={softBadgeClass}>
          <FolderKanban size={12} />
          {testimonial.project_name}
        </span>
      </div>,

      <div className="min-w-32" key={`${testimonial.id}-rating`}>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={`${testimonial.id}-star-${index}`}
              size={14}
              className={
                index < Number(testimonial.calificacion ?? 0)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground/30"
              }
            />
          ))}
        </div>
      </div>,

      <div className="min-w-32" key={`${testimonial.id}-status`}>
        <span
          className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide ${
            testimonial.activo
              ? "bg-primary text-white shadow-sm"
              : "bg-muted/70 text-muted-foreground"
          }`}
        >
          {testimonial.activo ? "Activo" : "Inactivo"}
        </span>
      </div>,

      <div className="flex min-w-36 items-center gap-2" key={`${testimonial.id}-actions`}>
        <button
          type="button"
          aria-label="Editar testimonio"
          onClick={() => openEdit(testimonial)}
          className={actionBtnClass}
        >
          <Edit2 size={15} />
        </button>

        <button
          type="button"
          aria-label="Eliminar testimonio"
          onClick={() => setDeleteId(testimonial.id)}
          className={actionBtnDangerClass}
        >
          <Trash2 size={15} />
        </button>
      </div>,
    ]);
  }, [rowsData]);

  const loading = loadingTestimonials || loadingProjects;

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm sm:p-5 lg:p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold sm:text-xl">Testimonios</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Administra los testimonios visibles y pendientes del sitio web
            </p>
          </div>

          <div className="w-full md:w-auto">
            <CustomButton
              text="Nuevo Testimonio"
              icon={<Plus size={16} />}
              onClick={openNew}
              size="md"
              fontSize="14px"
              variant="primary"
              className="w-full justify-center px-4! md:w-auto"
            />
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
              emptyText="No hay testimonios registrados"
              columnWidths={[
                "110px",
                "320px",
                "220px",
                "200px",
                "140px",
                "130px",
                "140px",
              ]}
              minWidth={1260}
              maxHeight={560}
            />
          </div>
        )}
      </div>

      <ModalAdminTestimonial
        open={modal}
        onClose={() => {
          setModal(false);
          resetForm();
        }}
        form={form}
        setForm={setForm}
        setFile={setFile}
        setImageUrl={setImageUrl}
        onSave={handleSave}
        loading={saving}
        isEdit={Boolean(editingId)}
        initialImage={editingId ? imageUrl : null}
        projects={projects.map((project) => ({
          id: project.id,
          titulo: project.titulo,
        }))}
      />

      <CustomImageViewer
        images={viewerImages}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />

      <CustomModalConfirm
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Eliminar testimonio"
        message="¿Seguro que deseas eliminar este testimonio? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </section>
  );
};

export default TestimonialsSection;