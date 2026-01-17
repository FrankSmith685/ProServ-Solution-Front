/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BaseVariant } from "@/shared/design/types";
import type { ReactNode } from "react";

export interface CustomSelectOption {
  value: string | number;
  label: string;
}

export interface CustomSelectProps {
  value?: string | number;
  onChange?: (e: any) => void;
  options: CustomSelectOption[];
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

export interface PropItem {
  name: string;
  description: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
  example?: string;
  values?: string[];
  notes?: string;
}

export interface DocumentComponentProps {
  name: string;
  description: string;
  props: PropItem[];
  controls?: ReactNode;
  preview: ReactNode;
}

