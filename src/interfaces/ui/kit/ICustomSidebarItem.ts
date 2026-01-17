import type { Variant } from "@/shared/design/types";
export type SidebarItemSize = "sm" | "md";

export interface ICustomSidebarItemProps {
  label: string;
  active?: boolean;
  variant?: Variant;
  disabled?: boolean;
  size?: SidebarItemSize;
  onClick?: () => void;
}
