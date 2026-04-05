import type { BaseVariant } from "./types";

type InputVariantStyle = {
  border: string;
  focusBorder: string;
  label: string;
  placeholder?: string;
};

export const inputVariantStyles: Record<BaseVariant, InputVariantStyle> = {
  primary: {
    border: "hsl(var(--color-border))",
    focusBorder: "hsl(var(--color-primary))",
    label: "hsl(var(--color-primary))",
  },

  secondary: {
    border: "hsl(var(--color-border))",
    focusBorder: "hsl(var(--color-secondary))",
    label: "hsl(var(--color-secondary))",
  },

  terciary: {
    border: "hsl(var(--color-border))",
    focusBorder: "hsl(var(--color-terciary))",
    label: "hsl(var(--color-terciary))",
  },

  warning: {
    border: "hsl(var(--color-border))",
    focusBorder: "hsl(var(--color-warning))",
    label: "hsl(var(--color-warning))",
  },

  error: {
    border: "hsl(var(--color-border))",
    focusBorder: "hsl(var(--color-error))",
    label: "hsl(var(--color-error))",
  },
};