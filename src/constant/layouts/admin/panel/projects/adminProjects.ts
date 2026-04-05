import {
  FolderKanban,
  FolderTree,
  Tags,
} from "lucide-react";

import type {
  AdminProjectsTabItem,
} from "@/interfaces/page/admin/panel/IAdminProjects";

export const ADMIN_PROJECTS_TABS: AdminProjectsTabItem[] = [
  {
    key: "projects",
    label: "Proyectos",
    description:
      "Gestiona los proyectos visibles en el sitio, sus imágenes, servicio, categoría, tags y estado.",
    icon: FolderKanban,
  },
  {
    key: "categories",
    label: "Categorías",
    description:
      "Administra las categorías que se asignan a los proyectos.",
    icon: FolderTree,
  },
  {
    key: "tags",
    label: "Tags",
    description:
      "Administra los tags o etiquetas que se asignan a los proyectos.",
    icon: Tags,
  },
];