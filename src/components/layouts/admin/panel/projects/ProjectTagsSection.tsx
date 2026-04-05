import { Tags, Plus, Trash2, Loader2 } from "lucide-react";
import type { FC } from "react";

import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomTable } from "@/components/ui/kit/CustomTable";

import { useTags } from "@/hooks/useTags";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";

import type { ProjectTagsSectionProps } from "@/interfaces/layouts/admin/panel/projects/IProjectTagsSection";

const ProjectTagsSection: FC<ProjectTagsSectionProps> = ({
  newTagName,
  loading = false,
  saving = false,
  deletingId = null,
  onTagNameChange,
  onCreateTag,
  onDeleteTag,
}) => {
  const { tags } = useTags();
  const { showMessage } = useNotification();

  const headers = ["Tag", "Slug", "Estado", "Acciones"];

  const rows = tags.map((tag) => [
    <div className="min-w-40" key={`${tag.id}-name`}>
      <span className="inline-flex rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-semibold">
        #{tag.nombre}
      </span>
    </div>,

    <div className="min-w-40" key={`${tag.id}-slug`}>
      <p className="text-sm text-muted-foreground">{tag.slug || "-"}</p>
    </div>,

    <div className="min-w-28" key={`${tag.id}-status`}>
      <span
        className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-semibold ${
          tag.activo
            ? "bg-primary text-white"
            : "bg-muted/70 text-muted-foreground"
        }`}
      >
        {tag.activo ? "Activo" : "Inactivo"}
      </span>
    </div>,

    <div className="flex min-w-24 items-center gap-2" key={`${tag.id}-actions`}>
      <button
        type="button"
        aria-label={`Eliminar tag ${tag.nombre}`}
        onClick={() => void onDeleteTag(tag.id)}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/8 text-red-500 transition-all duration-200 hover:bg-red-500/15"
      >
        {deletingId === tag.id ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <Trash2 size={15} />
        )}
      </button>
    </div>,
  ]);

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
      <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-6 xl:col-span-4">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Tags size={20} />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-primary sm:text-lg">
              Nuevo tag
            </h3>
            <p className="text-sm text-muted-foreground">
              Crea etiquetas para clasificar proyectos.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <CustomInput
            label="Nombre del tag"
            value={newTagName}
            onChange={onTagNameChange}
            placeholder="Ej. React"
            fullWidth
          />

          <CustomButton
            text={saving ? "Guardando..." : "Crear tag"}
            icon={
              saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )
            }
            onClick={() => {
              if (!newTagName.trim()) {
                showMessage("El nombre del tag es obligatorio", "error");
                return;
              }

              void onCreateTag();
            }}
            variant="primary"
            size="md"
            fontSize="14px"
            disabled={saving}
            className="w-full! justify-center gap-2!"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-6 xl:col-span-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Tags size={20} />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-primary sm:text-lg">
              Listado de tags
            </h3>
            <p className="text-sm text-muted-foreground">
              Visualiza y elimina tags disponibles.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface-soft">
          <CustomTable
            headers={headers}
            data={rows}
            loading={loading}
            rows={5}
            columns={headers.length}
            emptyText="No hay tags registrados"
            columnWidths={["220px", "260px", "140px", "120px"]}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectTagsSection;