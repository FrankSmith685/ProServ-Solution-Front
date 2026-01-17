import type { SelectChangeEvent } from "@mui/material";
import type { ReactNode } from "react";
import type { BaseVariant } from "@/shared/design/types";

export interface CustomSelectOption<T extends string | number = string> {
  value: T;
  label: string;
}

export interface CustomSelectProps<T extends string | number = string> {
  value: T | "";
  onChange: (
    event: SelectChangeEvent<T>,
    child: ReactNode
  ) => void;
  options: CustomSelectOption<T>[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: BaseVariant;
  size?: "md" | "lg";
  fontSize?: string;
  fontFamily?: string;
  error?: boolean;
  helperText?: string;
}
