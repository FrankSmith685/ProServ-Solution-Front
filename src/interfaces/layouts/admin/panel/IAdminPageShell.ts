import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface AdminPanelTabItem<T extends string = string> {
  key: T;
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface AdminPageHeaderAction {
  text: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  component?: "button" | "a";
  target?: string;
  rel?: string;
  variant?:
    | "primary"
    | "secondary"
    | "secondary-outline"
    | "error"
    | "terciary";
}

export interface AdminPageHeaderProps {
  badgeText: string;
  badgeIcon: LucideIcon;
  title: string;
  description: string;
  activeSectionLabel: string;
  activeSectionIcon: LucideIcon;
  secondaryAction?: AdminPageHeaderAction;
  primaryAction?: AdminPageHeaderAction;
}

export interface AdminTabsCardProps<T extends string = string> {
  key?: string;
  title: string;
  subtitle: string;
  tabs: AdminPanelTabItem<T>[];
  activeTab: T;
  onChangeTab: (tab: T) => void;
}