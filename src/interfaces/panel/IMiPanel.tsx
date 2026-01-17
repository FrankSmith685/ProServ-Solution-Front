export type ActionBarProps = {
  visible: boolean;
  loading: boolean;
  onSave: () => void;
};

import type React from "react";
import type {
  SidebarSubMenuItem,
  SidebarSubMenuLink,
} from "@/interfaces/ui/navigation/ICustomSidebarSubMenu";

export type LoginMethod = "password" | "google" | "facebook" | "apple";

export interface PanelUser {
  id: string;
  name: string;
  email: string;
  metodosLogin: LoginMethod[];
}

export interface PanelMenu {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  menuData: readonly SidebarSubMenuItem[];
}

export type FindActiveItemFn = (
  menuData: readonly SidebarSubMenuItem[],
  pathname: string
) => SidebarSubMenuLink | null;

