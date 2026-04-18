/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Plus,
  Trash2,
  Loader2,
  Edit2,
  Image as ImageIcon,
  Eye,
  Star,
  CalendarDays,
  Briefcase,
  FolderTree,
} from "lucide-react";

import { useProjects } from "@/hooks/useProjects";
import { useServices } from "@/hooks/useServices";
import { useCategories } from "@/hooks/useCategories";
import { useTags } from "@/hooks/useTags";

import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomTable } from "@/components/ui/kit/CustomTable";
import { CustomModalConfirm } from "@/components/ui/overlay/CustomModalConfirm";
import { CustomImageViewer } from "@/components/ui/media/CustomImageViewer";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";

import type {
  ProjectForm,
  ProjectUI,
  ViewerImageItem,
} from "@/interfaces/layouts/admin/panel/projects/IProjectSection";

import { ModalAdminProject } from "../ModalAdminProject";

const INITIAL_FORM: ProjectForm = {
  titulo: "",
  descripcion: "",
  cliente: "",
  servicio_id: "",
  categoria_id: "",
  destacado: false,
  activo: true,
  tags: [],
  images: [],
};

const TABLE_HEADERS: string[] = [
  "Imagen",
  "Proyecto",
  "Cliente",
  "Servicio",
  "Categoría",
  "Tags",
  "Fecha",
  "Estado",
  "Acciones",
];

const actionBtnClass =
  "flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface transition-all duration-200 hover:bg-muted/60";

const actionBtnDangerClass =
  "flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/8 text-red-500 transition-all duration-200 hover:bg-red-500/15";

const softBadgeClass =
  "inline-flex items-center gap-1 rounded-full border border-border bg-muted/30 px-3 py-1 text-[11px] font-medium text-(--color-text)";

const ProjectsSection = () => {
  const {
    projects,
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    loading: loadingProjects,
  } = useProjects();

  const { services, getServices, loading: loadingServices } = useServices();
  const { categories, getCategories, loading: loadingCategories } =
    useCategories();
  const { tags, getTags, loading: loadingTags } = useTags();

  const { showMessage } = useNotification();

  const [modal, setModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  const [form, setForm] = useState<ProjectForm>(INITIAL_FORM);
  const [files, setFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [viewerImages, setViewerImages] = useState<ViewerImageItem[]>([]);
  const [viewerOpen, setViewerOpen] = useState<boolean>(false);
  const [viewerIndex, setViewerIndex] = useState<number>(0);

  useEffect(() => {
    getProjects();
    getServices();
    getCategories();
    getTags();
  }, []);

  const rowsData: ProjectUI[] = useMemo(() => {
    return [...projects].map((project) => {
      const firstImageUrl =
        project.images?.find((img) => img.media?.url)?.media?.url ?? null;

      return {
        id: project.id,
        titulo: project.titulo ?? "",
        descripcion: project.descripcion ?? "",
        cliente: project.cliente ?? "",
        servicio_id: project.servicio_id,
        categoria_id: project.categoria_id,
        fecha: project.fecha ?? null,
        destacado: Boolean(project.destacado),
        activo: Boolean(project.activo),
        service_name: project.service?.titulo ?? "-",
        category_name: project.category?.nombre ?? "-",
        tags: project.tags ?? [],
        images: project.images ?? [],
        first_image_url: firstImageUrl,
      };
    });
  }, [projects]);

  const resetForm = (): void => {
    setForm(INITIAL_FORM);
    setFiles([]);
    setImageUrls([]);
    setEditingId(null);
  };

  const openNew = (): void => {
    resetForm();
    setModal(true);
  };

  const openEdit = (project: ProjectUI): void => {
    setEditingId(project.id);

    setForm({
      id: project.id,
      titulo: project.titulo,
      descripcion: project.descripcion,
      cliente: project.cliente,
      servicio_id: project.servicio_id,
      categoria_id: project.categoria_id,
      destacado: project.destacado,
      activo: project.activo,
      tags: project.tags ?? [],
      images: project.images,
    });

    setFiles([]);
    setImageUrls([]);
    setModal(true);
  };

  const handleSave = async (): Promise<void> => {
    setSaving(true);

    if (editingId) {
      await updateProject(editingId, form, files, imageUrls, ({ success, message }) => {
        if (success) {
          showMessage(message || "Proyecto actualizado correctamente", "success");
          setModal(false);
          resetForm();
        } else {
          showMessage(message || "Ocurrió un error al actualizar el proyecto", "error");
        }
      });
    } else {
      await createProject(form, files, imageUrls, ({ success, message }) => {
        if (success) {
          showMessage(message || "Proyecto creado correctamente", "success");
          setModal(false);
          resetForm();
        } else {
          showMessage(message || "Ocurrió un error al crear el proyecto", "error");
        }
      });
    }

    setSaving(false);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!deleteId) return;

    setDeleting(true);

    await deleteProject(deleteId, ({ success, message }) => {
      if (success) {
        showMessage(message || "Proyecto eliminado correctamente", "success");
        setDeleteId(null);
      } else {
        showMessage(message || "Error al eliminar el proyecto", "error");
      }
    });

    setDeleting(false);
  };

  const openViewer = (project: ProjectUI, selectedIndex = 0): void => {
    const images: ViewerImageItem[] = project.images
      .filter((img) => img.media?.url)
      .map((img) => ({
        src: img.media?.url as string,
        alt: project.titulo,
      }));

    setViewerImages(images);
    setViewerIndex(selectedIndex);
    setViewerOpen(true);
  };

  const tableRows: ReactNode[][] = useMemo(() => {
    return rowsData.map((project) => [
      project.first_image_url ? (
        <button
          key={`${project.id}-image`}
          type="button"
          onClick={() => openViewer(project)}
          className="group flex items-center justify-center"
          aria-label={`Ver imágenes de ${project.titulo || "proyecto"}`}
        >
          <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/20 shadow-sm">
            <img
              src={project.first_image_url}
              alt={project.titulo}
              className="h-16 w-24 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </button>
      ) : (
        <div
          key={`${project.id}-image-empty`}
          className="flex h-16 w-24 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 text-muted-foreground"
        >
          <ImageIcon size={18} />
        </div>
      ),

      <div className="min-w-56 max-w-72" key={`${project.id}-project`}>
        <div className="space-y-2">
          <p className="line-clamp-2 text-sm font-semibold leading-5 text-(--color-text) sm:text-[15px]">
            {project.titulo || "Sin título"}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {project.destacado ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
                <Star size={11} />
                Destacado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/20 px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                Normal
              </span>
            )}
          </div>
        </div>
      </div>,

      <div className="min-w-40 max-w-56" key={`${project.id}-client`}>
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Briefcase size={13} />
            Cliente
          </span>

          <p className="line-clamp-2 text-sm leading-5 text-(--color-text)">
            {project.cliente || "-"}
          </p>
        </div>
      </div>,

      <div className="min-w-40" key={`${project.id}-service`}>
        <span className={softBadgeClass}>{project.service_name}</span>
      </div>,

      <div className="min-w-40" key={`${project.id}-category`}>
        <span className={softBadgeClass}>
          <FolderTree size={12} />
          {project.category_name}
        </span>
      </div>,

      <div className="min-w-44 max-w-56" key={`${project.id}-tags`}>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.length > 0 ? (
            project.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-medium"
              >
                #{tag.nombre}
              </span>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">Sin tags</span>
          )}
        </div>
      </div>,

      <div className="min-w-36" key={`${project.id}-date`}>
        <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted-foreground">
          <CalendarDays size={14} />
          <span>
            {project.fecha ? new Date(project.fecha).toLocaleDateString() : "-"}
          </span>
        </div>
      </div>,

      <div className="min-w-32" key={`${project.id}-status`}>
        <span
          className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide ${
            project.activo
              ? "bg-primary text-white shadow-sm"
              : "bg-muted/70 text-muted-foreground"
          }`}
        >
          {project.activo ? "Activo" : "Inactivo"}
        </span>
      </div>,

      <div className="flex min-w-36 items-center gap-2" key={`${project.id}-actions`}>
        <button
          type="button"
          aria-label="Ver imágenes"
          onClick={() => {
            if (project.images.length) openViewer(project);
          }}
          className={actionBtnClass}
        >
          <Eye size={15} />
        </button>

        <button
          type="button"
          aria-label="Editar proyecto"
          onClick={() => openEdit(project)}
          className={actionBtnClass}
        >
          <Edit2 size={15} />
        </button>

        <button
          type="button"
          aria-label="Eliminar proyecto"
          onClick={() => setDeleteId(project.id)}
          className={actionBtnDangerClass}
        >
          <Trash2 size={15} />
        </button>
      </div>,
    ]);
  }, [rowsData]);

  const loading =
    loadingProjects || loadingServices || loadingCategories || loadingTags;

  const metrics = useMemo(() => {
    const active = rowsData.filter((item) => item.activo).length;
    const featured = rowsData.filter((item) => item.destacado).length;
    const withImages = rowsData.filter((item) => Boolean(item.first_image_url)).length;

    return {
      active,
      inactive: rowsData.length - active,
      featured,
      withImages,
    };
  }, [rowsData]);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm sm:p-5 lg:p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold sm:text-xl">Proyectos</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Administra los proyectos visibles en el sitio web
            </p>
          </div>

          <div className="w-full md:w-auto">
            <CustomButton
              text="Nuevo Proyecto"
              icon={<Plus size={16} />}
              onClick={openNew}
              size="md"
              fontSize="14px"
              variant="primary"
              className="w-full justify-center px-4! md:w-auto"
            />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-border bg-surface-soft p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Total
            </p>
            <p className="mt-2 text-2xl font-black text-dark">{rowsData.length}</p>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Activos
            </p>
            <p className="mt-2 text-2xl font-black text-dark">{metrics.active}</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface-soft p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Destacados
            </p>
            <p className="mt-2 text-2xl font-black text-dark">{metrics.featured}</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface-soft p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Con imágenes
            </p>
            <p className="mt-2 text-2xl font-black text-dark">{metrics.withImages}</p>
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
              emptyText="No hay proyectos registrados"
              columnWidths={[
                "130px",
                "280px",
                "220px",
                "170px",
                "180px",
                "220px",
                "150px",
                "130px",
                "160px",
              ]}
              minWidth={1640}
              maxHeight={560}
            />
          </div>
        )}
      </div>

      <ModalAdminProject
        open={modal}
        onClose={() => {
          setModal(false);
          resetForm();
        }}
        form={form}
        setForm={setForm}
        setFiles={setFiles}
        setImageUrls={setImageUrls}
        onSave={handleSave}
        loading={saving}
        isEdit={Boolean(editingId)}
        services={services}
        categories={categories}
        tags={tags}
      />

      <CustomImageViewer
        images={viewerImages}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        startIndex={viewerIndex}
      />

      <CustomModalConfirm
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Eliminar proyecto"
        message="¿Seguro que deseas eliminar este proyecto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </section>
  );
};

export default ProjectsSection;
