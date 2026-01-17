import type { BaseVariant } from "@/shared/design/types";
import type { SidebarItemSize } from "../kit/ICustomSidebarItem";

export interface DocumentSidebarItemState {
  label: string;
  variant: BaseVariant;
  size: SidebarItemSize;
  active: boolean;
  disabled: boolean;
}
