import type { BaseVariant } from "@/shared/design/types";
import type { SwitchSize } from "../kit/ICustomSwitch";

export interface DocumentSwitchState {
  variant: BaseVariant;
  label: string;
  checked: boolean;
  disabled: boolean;
  size: SwitchSize;
  fontFamily: string;
  fontSize: string;
}
