import type { LucideIcon } from "lucide-react";

export type AdminTestimonialsTab = "testimonials";

export interface AdminTestimonialsTabItem {
  key: AdminTestimonialsTab;
  label: string;
  description: string;
  icon: LucideIcon;
}