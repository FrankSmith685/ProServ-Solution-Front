import { FolderTree, Plus, Trash2, Loader2 } from "lucide-react";
import type { FC } from "react";

import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomTable } from "@/components/ui/kit/CustomTable";

import { useCategories } from "@/hooks/useCategories";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";

import type { ProjectCategoriesSectionProps } from "@/interfaces/layouts/admin/panel/projects/IProjectCategoriesSection";

const ProjectCategoriesSection: FC<ProjectCategoriesSectionProps> = ({
  newCategoryName,
  newCategoryDescription,
  loading = false,
  saving = false,
  deletingId = null,
  onCategoryNameChange,
  onCategoryDescriptionChange,
  onCreateCategory,
  onDeleteCategory,
}) => {
  const { categories } = useCategories();
  const { showMessage } = useNotification();

  const headers = ["Nombre", "Descripción", "Estado", "Acciones"];

  const rows = categories.map((category) => [
    <div className="min-w-40" key={`${category.id}-name`}>
      <p className="font-semibold text-(--color-text)">{category.nombre}</p>
    </div>,

    <div className="min-w-60 max-w-90" key={`${category.id}-desc`}>
      <p className="line-clamp-2 text-sm text-muted-foreground">
        {category.descripcion || "-"}
      </p>
    </div>,

    <div className="min-w-28" key={`${category.id}-status`}>
      <span
        className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-semibold ${
          category.activo
            ? "bg-primary text-white"
            : "bg-muted/70 text-muted-foreground"
        }`}
      >
        {category.activo ? "Activa" : "Inactiva"}
      </span>
    </div>,

    <div className="flex min-w-24 items-center gap-2" key={`${category.id}-actions`}>
      <button
        type="button"
        aria-label={`Eliminar categoría ${category.nombre}`}
        onClick={() => void onDeleteCategory(category.id)}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/8 text-red-500 transition-all duration-200 hover:bg-red-500/15"
      >
        {deletingId === category.id ? (
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
            <FolderTree size={20} />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-primary sm:text-lg">
              Nueva categoría
            </h3>
            <p className="text-sm text-muted-foreground">
              Crea categorías para clasificar proyectos.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <CustomInput
            label="Nombre"
            value={newCategoryName}
            onChange={onCategoryNameChange}
            placeholder="Ej. Branding"
            fullWidth
          />

          <CustomInput
            label="Descripción"
            value={newCategoryDescription}
            onChange={onCategoryDescriptionChange}
            placeholder="Describe la categoría..."
            multiline
            rows={4}
            fullWidth
          />

          <CustomButton
            text={saving ? "Guardando..." : "Crear categoría"}
            icon={
              saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )
            }
            onClick={() => {
              if (!newCategoryName.trim()) {
                showMessage("El nombre de la categoría es obligatorio", "error");
                return;
              }

              void onCreateCategory();
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
            <FolderTree size={20} />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-primary sm:text-lg">
              Listado de categorías
            </h3>
            <p className="text-sm text-muted-foreground">
              Visualiza y elimina categorías disponibles.
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
            emptyText="No hay categorías registradas"
            columnWidths={["220px", "420px", "140px", "120px"]}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectCategoriesSection;