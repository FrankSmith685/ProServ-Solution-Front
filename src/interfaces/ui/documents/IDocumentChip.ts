import type { Variant } from "@/shared/design/types";
import type { ChipSize } from "../kit/ICustomChip";
export interface DocumentChipState {
  label: string;
  variant: Variant;
  size: ChipSize;
  selected: boolean;
  clickable: boolean;
  deletable: boolean;
}
