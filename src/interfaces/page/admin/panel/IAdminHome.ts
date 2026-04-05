// import type { LucideIcon } from "lucide-react";


// export type AdminHomeTab = "slides" | "config";

// export interface AdminTabItem {
//   key: AdminHomeTab;
//   label: string;
//   description: string;
//   icon: LucideIcon;
// }

// import type { AdminPanelTabItem } from "@/interfaces/ui/admin/IAdminPageShell";
import type { AdminPanelTabItem } from "@/interfaces/layouts/admin/panel/IAdminPageShell";

export type AdminHomeTab = "slides" | "config";
export type AdminTabItem = AdminPanelTabItem<AdminHomeTab>;