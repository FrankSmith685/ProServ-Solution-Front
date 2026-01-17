import type { Variant } from "@/shared/design/types";

export type CheckboxVariantStyle = {
  color: string;
  border: string;
  checked: string;
};

export const checkboxVariantStyles: Record<Variant, CheckboxVariantStyle> = {
  primary: {
    color: "var(--color-primary)",
    border: "var(--color-primary)",
    checked: "var(--color-primary)",
  },
  secondary: {
    color: "var(--color-secondary)",
    border: "var(--color-secondary)",
    checked: "var(--color-secondary)",
  },
  terciary: {
    color: "var(--color-terciary)",
    border: "var(--color-terciary)",
    checked: "var(--color-terciary)",
  },
  warning: {
    color: "var(--color-warning)",
    border: "var(--color-warning)",
    checked: "var(--color-warning)",
  },

  /* Outline (preparado) */
  "primary-outline": {
    color: "var(--color-primary)",
    border: "var(--color-primary)",
    checked: "var(--color-primary)",
  },
  "secondary-outline": {
    color: "var(--color-secondary)",
    border: "var(--color-secondary)",
    checked: "var(--color-secondary)",
  },
  "terciary-outline": {
    color: "var(--color-terciary)",
    border: "var(--color-terciary)",
    checked: "var(--color-terciary)",
  },
  "warning-outline": {
    color: "var(--color-warning)",
    border: "var(--color-warning)",
    checked: "var(--color-warning)",
  },
};
