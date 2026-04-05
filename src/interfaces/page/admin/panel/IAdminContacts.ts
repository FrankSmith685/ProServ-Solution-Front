import type { LucideIcon } from "lucide-react";

export type AdminContactsTab = "contacts" | "quotes" | "requests";

export interface AdminContactsTabItem {
  key: AdminContactsTab;
  label: string;
  description: string;
  icon: LucideIcon;
}