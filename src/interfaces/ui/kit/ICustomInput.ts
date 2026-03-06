import type { BaseVariant } from "@/shared/design/types";
import type { InputBaseComponentProps } from "@mui/material";
import type {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  ReactNode,
  Ref,
} from "react";

export type InputSize = "md" | "lg";

export type CustomInputType =
  | "text"
  | "password"
  | "search"
  | "number"
  | "email"
  | "tel"
  | "url"
  | "time"
  | "date";

export interface CustomInputProps {
  name?: string;
  inputRef?: Ref<HTMLInputElement | HTMLTextAreaElement>;

  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;

  placeholder?: string;
  type?: CustomInputType;

  disabled?: boolean;
  fullWidth?: boolean;
  variant?: BaseVariant;
  size?: InputSize;

  ariaLabel?: string;
  fontSize?: string;
  fontFamily?: string;

  icon?: ReactNode;
  label?: string;
  required?: boolean;

  error?: boolean;
  helperText?: string;

  multiline?: boolean;
  rows?: number;
  autoComplete?: string;

  onFocus?: (
    e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;

  onBlur?: (
    e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;

  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;

  inputProps?: InputBaseComponentProps;
}
