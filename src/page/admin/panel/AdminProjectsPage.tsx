import { useMemo, useState, type ChangeEvent, type FC } from "react";
import { Eye, FolderKanban, Loader2 } from "lucide-react";

import ProjectsSection from "@/components/layouts/admin/panel/projects/ProjectsSection";
import ProjectCategoriesSection from "@/components/layouts/admin/panel/projects/ProjectCategoriesSection";
import ProjectTagsSection from "@/components/layouts/admin/panel/projects/ProjectTagsSection";

import { useCategories } from "@/hooks/useCategories";
import { useTags } from "@/hooks/useTags";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";

import { ADMIN_PROJECTS_TABS } from "@/constant/layouts/admin/panel/projects/adminProjects";

import type {
  AdminProjectsTab,
  AdminProjectsTabItem,
} from "@/interfaces/page/admin/panel/IAdminProjects";
import AdminPageHeader from "@/components/layouts/admin/panel/AdminPageHeader";
import AdminTabsCard from "@/components/layouts/admin/panel/AdminTabsCard";

const AdminProjectsPage: FC = () => {
  const [tab, setTab] = useState<AdminProjectsTab>("projects");

  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [newCategoryDescription, setNewCategoryDescription] =
    useState<string>("");

  const [newTagName, setNewTagName] = useState<string>("");

  const [savingCategory, setSavingCategory] = useState<boolean>(false);
  const [savingTag, setSavingTag] = useState<boolean>(false);

  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null
  );
  const [deletingTagId, setDeletingTagId] = useState<string | null>(null);

  const {
    createCategory,
    deleteCategory,
    loading: loadingCategories,
  } = useCategories();

  const {
    createTag,
    deleteTag,
    loading: loadingTags,
  } = useTags();

  const { showMessage } = useNotification();

  const currentTab = useMemo<AdminProjectsTabItem>(() => {
    return (
      ADMIN_PROJECTS_TABS.find((item) => item.key === tab) ??
      ADMIN_PROJECTS_TABS[0]
    );
  }, [tab]);

  const handleCategoryNameChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    setNewCategoryName(e.target.value);
  };

  const handleCategoryDescriptionChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setNewCategoryDescription(e.target.value);
  };

  const handleTagNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNewTagName(e.target.value);
  };

  const handleCreateCategory = async (): Promise<void> => {
    if (!newCategoryName.trim()) {
      showMessage("El nombre de la categoría es obligatorio", "error");
      return;
    }

    setSavingCategory(true);

    await createCategory(
      {
        nombre: newCategoryName.trim(),
        descripcion: newCategoryDescription.trim() || "",
        activo: true,
      },
      ({ success, message }) => {
        if (success) {
          showMessage(message || "Categoría creada correctamente", "success");
          setNewCategoryName("");
          setNewCategoryDescription("");
        } else {
          showMessage(message || "Error al crear categoría", "error");
        }
      }
    );

    setSavingCategory(false);
  };

  const handleDeleteCategory = async (id: string): Promise<void> => {
    setDeletingCategoryId(id);

    await deleteCategory(id, ({ success, message }) => {
      if (success) {
        showMessage(message || "Categoría eliminada correctamente", "success");
      } else {
        showMessage(message || "Error al eliminar categoría", "error");
      }
    });

    setDeletingCategoryId(null);
  };

  const handleCreateTag = async (): Promise<void> => {
    if (!newTagName.trim()) {
      showMessage("El nombre del tag es obligatorio", "error");
      return;
    }

    setSavingTag(true);

    await createTag(
      {
        nombre: newTagName.trim(),
        activo: true,
      },
      ({ success, message }) => {
        if (success) {
          showMessage(message || "Tag creado correctamente", "success");
          setNewTagName("");
        } else {
          showMessage(message || "Error al crear tag", "error");
        }
      }
    );

    setSavingTag(false);
  };

  const handleDeleteTag = async (id: string): Promise<void> => {
    setDeletingTagId(id);

    await deleteTag(id, ({ success, message }) => {
      if (success) {
        showMessage(message || "Tag eliminado correctamente", "success");
      } else {
        showMessage(message || "Error al eliminar tag", "error");
      }
    });

    setDeletingTagId(null);
  };

  const renderContent = (): React.ReactNode => {
    switch (tab) {
      case "projects":
        return <ProjectsSection />;

      case "categories":
        return (
          <ProjectCategoriesSection
            newCategoryName={newCategoryName}
            newCategoryDescription={newCategoryDescription}
            loading={loadingCategories}
            saving={savingCategory}
            deletingId={deletingCategoryId}
            onCategoryNameChange={handleCategoryNameChange}
            onCategoryDescriptionChange={handleCategoryDescriptionChange}
            onCreateCategory={handleCreateCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        );

      case "tags":
        return (
          <ProjectTagsSection
            newTagName={newTagName}
            loading={loadingTags}
            saving={savingTag}
            deletingId={deletingTagId}
            onTagNameChange={handleTagNameChange}
            onCreateTag={handleCreateTag}
            onDeleteTag={handleDeleteTag}
          />
        );

      default:
        return null;
    }
  };

  const loading =
    tab === "categories"
      ? loadingCategories
      : tab === "tags"
        ? loadingTags
        : false;

  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader
        badgeText="Administración de Proyectos"
        badgeIcon={FolderKanban}
        title="Proyectos"
        description="Gestiona proyectos, categorías y tags desde una interfaz más ordenada, consistente y alineada con el resto del panel."
        activeSectionLabel={currentTab.label}
        activeSectionIcon={currentTab.icon}
        secondaryAction={{
          text: "Ver sitio",
          icon: <Eye size={16} />,
          component: "a",
          href: "/proyectos",
          target: "_blank",
          rel: "noreferrer",
          variant: "secondary-outline",
        }}
      />

      <AdminTabsCard
        title="Módulos de administración"
        subtitle="Cambia entre la gestión de proyectos, categorías y tags."
        tabs={ADMIN_PROJECTS_TABS}
        activeTab={tab}
        onChangeTab={setTab}
      />

      <section className="space-y-4">
        {loading && tab !== "projects" ? (
          <div className="flex min-h-72 items-center justify-center rounded-3xl border border-border bg-surface">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          renderContent()
        )}
      </section>
    </div>
  );
};

export default AdminProjectsPage;