import type { BaseVariant } from "@/shared/design/types";
import type { CustomInputType, InputSize } from "../kit/ICustomInput";

export interface DocumentInputState {
  variant: BaseVariant;
  value: string;
  label: string;
  disabled: boolean;
  size: InputSize;
  fontFamily: string;
  fontSize: string;
  fullWidth: boolean;
  placeholder: string;
  required: boolean;
  error: boolean;
  helperText: string;
  multiline: boolean;
  rows: number;
  type: CustomInputType;
  withIcon: boolean;
}
