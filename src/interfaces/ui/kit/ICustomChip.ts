import type { Variant } from "@/shared/design/types";

export type ChipSize = "small" | "medium";

export interface CustomChipProps {
  label: string;
  variant?: Variant;
  size?: ChipSize;
  selected?: boolean;
  clickable?: boolean;
  onDelete?: () => void;
}
