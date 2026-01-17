import type { IconType } from "react-icons";

export interface SidebarSubMenuItems {
  label: string;
  icon: IconType;
  path?: string;
  children?: SidebarSubMenuItems[];
}

export interface CustomSidebarSubMenuProps {
  title: string;
  titleIcon?: IconType;
  menuData: SidebarSubMenuItems[];
  onItemClick?: () => void;
}

export interface SidebarSubMenuBase {
  label: string;
  icon: IconType;
}

export interface SidebarSubMenuLink extends SidebarSubMenuBase {
  type: "link";
  path: string;
}

export interface SidebarSubMenuGroup extends SidebarSubMenuBase {
  type: "group";
  children: readonly SidebarSubMenuLink[];
}

export type SidebarSubMenuItem =
  | SidebarSubMenuLink
  | SidebarSubMenuGroup;


export interface SidebarSubMenuSection {
  title: string;
  icon: IconType;
  menuData: readonly SidebarSubMenuItem[];
}

