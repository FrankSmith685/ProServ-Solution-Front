import type { IconType } from "react-icons";

export interface SidebarMenuItems {
  label: string;
  path: string;
  icon?: IconType;
  isActive?: boolean;
}

export interface CustomSidebarMenuProps {
  items: SidebarMenuItems[];
  currentPath: string;
  isUserMenuOpen?: boolean;
  userType?: number | null;
  hasService?: boolean | null;
  hasPlan?: boolean | null;
}