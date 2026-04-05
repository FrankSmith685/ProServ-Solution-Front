import type { BaseVariant } from "@/shared/design/types";

export interface DocumentSelectedState {
  variant: BaseVariant;
  value: string;
  label: string;
  disabled: boolean;
  size: "sm" | "md" | "lg";
  fontFamily: string;
  fontSize: string;
  fullWidth: boolean;
}
