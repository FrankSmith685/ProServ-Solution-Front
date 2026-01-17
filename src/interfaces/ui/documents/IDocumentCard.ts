import type { Variant } from "@/shared/design/types";

export interface DocumentCardState {
  title: string;
  description: string;
  variant: Variant;
  hoverable: boolean;
  fullWidth: boolean;
  withHeaderExtra: boolean;
}
