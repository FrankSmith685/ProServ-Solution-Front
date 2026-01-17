import type { Variant } from "@/shared/design/types";

export type ChipVariantStyle = {
  bg: string;
  color: string;
  hoverBg: string;
  border?: string;
  hoverColor?: string;
};

export const chipVariantStyles: Record<Variant, ChipVariantStyle> = {
  primary: {
    bg: "var(--color-primary)",
    color: "#fff",
    hoverBg: "var(--color-primary-hover)",
  },
  secondary: {
    bg: "var(--color-secondary)",
    color: "#fff",
    hoverBg: "var(--color-secondary-hover)",
  },
  terciary: {
    bg: "var(--color-terciary)",
    color: "#fff",
    hoverBg: "var(--color-terciary-hover)",
  },
  warning: {
    bg: "var(--color-warning)",
    color: "#fff",
    hoverBg: "var(--color-warning-hover)",
  },

  "primary-outline": {
    bg: "transparent",
    color: "var(--color-primary)",
    hoverBg: "var(--color-primary-alpha-12)",
    border: "1px solid var(--color-primary)",
  },
  "secondary-outline": {
    bg: "transparent",
    color: "var(--color-secondary)",
    hoverBg: "var(--color-secondary-soft)",
    border: "1px solid var(--color-secondary)",
  },
  "terciary-outline": {
    bg: "transparent",
    color: "var(--color-terciary)",
    hoverBg: "var(--color-terciary-soft)",
    border: "1px solid var(--color-terciary)",
  },
  "warning-outline": {
    bg: "transparent",
    color: "var(--color-warning)",
    hoverBg: "var(--color-warning-soft)",
    border: "1px solid var(--color-warning)",
  },
};
