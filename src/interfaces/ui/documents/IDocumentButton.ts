import type { Variant } from "@/shared/design/types";
import type { ButtonSize } from "../kit/ICustomButton";

export interface DocumentButtonState {
  text: string;
  variant: Variant;
  size: ButtonSize;
  fullWidth: boolean;
  uppercase: boolean;
  disabled: boolean;
  loading: boolean;
  fontSize: string;
  fontFamily: string;
  fontWeight: number;
  withIcon: boolean;
}
