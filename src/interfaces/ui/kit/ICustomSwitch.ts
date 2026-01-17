import type { ChangeEvent } from "react";

export type SwitchSize = "lg" | "md";

export type SwitchVariant = keyof typeof import(
  "@/shared/design/inputVariants"
).inputVariantStyles;

export interface CustomSwitchProps {
  label?: string;
  checked: boolean;
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
  variant?: SwitchVariant;
  size?: SwitchSize;
  fontSize?: string;
  fontFamily?: string;
  disabled?: boolean;
}
