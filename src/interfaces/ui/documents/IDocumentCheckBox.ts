import type { Variant } from "@/shared/design/types";
import type { CheckboxSize } from "../kit/ICustomCheckbox";

export interface DocumentCheckboxState {
  label: string;
  checked: boolean;
  variant: Variant;
  disabled: boolean;
  size: CheckboxSize;
  fontSize: string;
  fontFamily: string;
}
