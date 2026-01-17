import type { ChangeEvent } from "react";
import type { Variant } from "@/shared/design/types";

export type CheckboxSize = "md" | "lg";

export interface CustomCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  variant?: Variant;
  size?: CheckboxSize;
  disabled?: boolean;
  fontSize?: string;
  fontFamily?: string;
}
