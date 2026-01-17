import type { BaseVariant } from "@/shared/design/types";
import type { InputSize } from "../kit/ICustomInput";

export interface DocumentPasswordState {
  label: string;
  value: string;
  variant: BaseVariant;
  size: InputSize;
  fontFamily: string;
  fontSize: string;
  placeholder: string;
  disabled: boolean;
  fullWidth: boolean;
  required: boolean;
  error: boolean;
  helperText: string;
}
