import type { Variant } from "@/shared/design/types";
import type { ReactNode } from "react";

export type ChipSize = "small" | "medium";

export interface CustomChipProps {
  label: ReactNode;
  variant?: Variant;
  size?: ChipSize;
  selected?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  icon?: ReactNode;
  deleteIcon?: ReactNode;
  className?: string;
}