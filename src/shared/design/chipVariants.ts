import type { Variant } from "./types";

type ChipVariantStyle = {
  bg: string;
  color: string;
  border: string;
  hoverBg: string;
  selectedRing: string;
};

export const chipVariantStyles = {
  /* ===============================
     SOLID
  =============================== */
  primary: {
    bg: "hsl(var(--color-primary))",
    color: "var(--color-on-dark)",
    border: "1px solid transparent",
    hoverBg: "hsl(var(--color-primary) / 0.88)",
    selectedRing: "hsl(var(--color-primary) / 0.35)",
  },

  secondary: {
    bg: "hsl(var(--color-secondary))",
    color: "var(--color-on-dark)",
    border: "1px solid transparent",
    hoverBg: "hsl(var(--color-secondary) / 0.88)",
    selectedRing: "hsl(var(--color-secondary) / 0.35)",
  },

  terciary: {
    bg: "hsl(var(--color-terciary))",
    color: "var(--color-on-dark)",
    border: "1px solid transparent",
    hoverBg: "hsl(var(--color-terciary) / 0.88)",
    selectedRing: "hsl(var(--color-terciary) / 0.35)",
  },

  warning: {
    bg: "hsl(var(--color-warning))",
    color: "var(--color-on-dark)",
    border: "1px solid transparent",
    hoverBg: "hsl(var(--color-warning) / 0.88)",
    selectedRing: "hsl(var(--color-warning) / 0.35)",
  },

  error: {
    bg: "hsl(var(--color-error))",
    color: "var(--color-on-dark)",
    border: "1px solid transparent",
    hoverBg: "hsl(var(--color-error) / 0.88)",
    selectedRing: "hsl(var(--color-error) / 0.35)",
  },

  /* ===============================
     OUTLINE
  =============================== */
  "primary-outline": {
    bg: "transparent",
    color: "hsl(var(--color-primary))",
    border: "1px solid hsl(var(--color-primary))",
    hoverBg: "hsl(var(--color-primary) / 0.10)",
    selectedRing: "hsl(var(--color-primary) / 0.30)",
  },

  "secondary-outline": {
    bg: "transparent",
    color: "hsl(var(--color-secondary))",
    border: "1px solid hsl(var(--color-secondary))",
    hoverBg: "hsl(var(--color-secondary) / 0.10)",
    selectedRing: "hsl(var(--color-secondary) / 0.30)",
  },

  "terciary-outline": {
    bg: "transparent",
    color: "hsl(var(--color-terciary))",
    border: "1px solid hsl(var(--color-terciary))",
    hoverBg: "hsl(var(--color-terciary) / 0.10)",
    selectedRing: "hsl(var(--color-terciary) / 0.30)",
  },

  "warning-outline": {
    bg: "transparent",
    color: "hsl(var(--color-warning))",
    border: "1px solid hsl(var(--color-warning))",
    hoverBg: "hsl(var(--color-warning) / 0.10)",
    selectedRing: "hsl(var(--color-warning) / 0.30)",
  },

  "error-outline": {
    bg: "transparent",
    color: "hsl(var(--color-error))",
    border: "1px solid hsl(var(--color-error))",
    hoverBg: "hsl(var(--color-error) / 0.10)",
    selectedRing: "hsl(var(--color-error) / 0.30)",
  },

  /* ===============================
     SPECIAL
  =============================== */
  "primary-outline-white": {
    bg: "transparent",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.9)",
    hoverBg: "rgba(255,255,255,0.10)",
    selectedRing: "rgba(255,255,255,0.30)",
  },
} satisfies Record<Variant, ChipVariantStyle>;