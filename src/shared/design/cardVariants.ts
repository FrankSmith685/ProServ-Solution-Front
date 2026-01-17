import type { Variant } from "./types";

type CardVariantStyle = {
  bg: string;
  border: string;
  color: string;
  hoverBg?: string;
};

export const cardVariantStyles: Record<Variant, CardVariantStyle> = {
  primary: {
    bg: "var(--color-primary-soft)",
    color: "var(--color-primary)",
    border: "1px solid var(--color-primary)",
    hoverBg: "var(--color-primary-alpha-12)",
  },
  secondary: {
    bg: "var(--color-secondary-soft)",
    color: "var(--color-secondary)",
    border: "1px solid var(--color-secondary)",
    hoverBg: "var(--color-secondary-alpha-12)",
  },
  terciary: {
    bg: "var(--color-terciary-soft)",
    color: "var(--color-terciary)",
    border: "1px solid var(--color-terciary)",
    hoverBg: "var(--color-terciary-alpha-12)",
  },
  warning: {
    bg: "var(--color-warning-soft)",
    color: "var(--color-warning)",
    border: "1px solid var(--color-warning)",
    hoverBg: "var(--color-warning-alpha-12)",
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
