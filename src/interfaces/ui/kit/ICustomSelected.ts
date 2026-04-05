import type { ReactNode, ChangeEvent } from "react";
import type { BaseVariant } from "@/shared/design/types";

export interface CustomSelectOption<T extends string | number = string> {
  value: T;
  label: string;
}

export interface CustomSelectProps<T extends string | number = string> {
  value: T | "";
  onChange: (
    event:
      | ChangeEvent<HTMLInputElement>
      | (Event & { target: { value: unknown; name: string } }),
    child?: ReactNode
  ) => void;
  options: CustomSelectOption<T>[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: BaseVariant;
  size?: "sm" | "md" | "lg";
  fontSize?: string;
  fontFamily?: string;
  error?: boolean;
  helperText?: string;
}