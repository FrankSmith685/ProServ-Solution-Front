import type { AdminPanelTabItem } from "@/interfaces/layouts/admin/panel/IAdminPageShell";


export type AdminProjectsTab = "projects" | "categories" | "tags";
export type AdminProjectsTabItem = AdminPanelTabItem<AdminProjectsTab>;