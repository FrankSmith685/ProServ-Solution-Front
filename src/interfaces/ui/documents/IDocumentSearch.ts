import type { BaseVariant } from "@/shared/design/types";
import type { InputSize } from "../kit/ICustomInput";

export interface DocumentSearchState {
  label: string;
  value: string;
  placeholder: string;
  variant: BaseVariant;
  size: InputSize;
  fontFamily: string;
  fontSize: string;

  disabled: boolean;
  fullWidth: boolean;
  error: boolean;
  helperText: string;
}
