import type { BaseVariant } from "./types";

export const inputVariantStyles: Record<
  BaseVariant,
  {
    border: string;
    focusBorder: string;
    label: string;
  }
> = {
  primary: {
    border: "var(--color-primary)",
    focusBorder: "var(--color-primary)",
    label: "var(--color-primary)",
  },
  secondary: {
    border: "var(--color-secondary)",
    focusBorder: "var(--color-secondary)",
    label: "var(--color-secondary)",
  },
  terciary: {
    border: "var(--color-terciary)",
    focusBorder: "var(--color-terciary)",
    label: "var(--color-terciary)",
  },
  warning: {
    border: "var(--color-warning)",
    focusBorder: "var(--color-warning)",
    label: "var(--color-warning)",
  },
};

export const neutralInput = {
  border: "#ccc",
  focusBorder: "#999",
  label: "#666",
  placeholder: "#9CA3AF",
};
