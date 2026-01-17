import type { Variant } from "./types";

type AlertVariantStyle = {
  bg: string;
  color: string;
  border: string;
};

export const alertVariantStyles: Record<Variant, AlertVariantStyle> = {
  primary: {
    bg: "var(--color-primary-soft)",
    color: "var(--color-primary)",
    border: "1px solid var(--color-primary)",
  },
  secondary: {
    bg: "var(--color-secondary-soft)",
    color: "var(--color-secondary)",
    border: "1px solid var(--color-secondary)",
  },
  terciary: {
    bg: "var(--color-terciary-soft)",
    color: "var(--color-terciary)",
    border: "1px solid var(--color-terciary)",
  },
  warning: {
    bg: "var(--color-warning-soft)",
    color: "var(--color-warning)",
    border: "1px solid var(--color-warning)",
  },

  /* ---------- Outline ---------- */
  "primary-outline": {
    bg: "transparent",
    color: "var(--color-primary)",
    border: "1px solid var(--color-primary)",
  },
  "secondary-outline": {
    bg: "transparent",
    color: "var(--color-secondary)",
    border: "1px solid var(--color-secondary)",
  },
  "terciary-outline": {
    bg: "transparent",
    color: "var(--color-terciary)",
    border: "1px solid var(--color-terciary)",
  },
  "warning-outline": {
    bg: "transparent",
    color: "var(--color-warning)",
    border: "1px solid var(--color-warning)",
  },
};
