import type { Variant } from "./types";

type ButtonVariantStyle = {
  bg: string;
  hover: string;
  color: string;
  border?: string;
};

export const buttonVariantStyles: Record<Variant, ButtonVariantStyle> = {
  primary: {
    bg: "var(--color-primary)",
    hover: "var(--color-primary-hover)",
    color: "#fff",
  },
  secondary: {
    bg: "var(--color-secondary)",
    hover: "var(--color-secondary-hover)",
    color: "#fff",
  },
  terciary: {
    bg: "var(--color-terciary)",
    hover: "var(--color-terciary-hover)",
    color: "#fff",
  },
  warning: {
    bg: "var(--color-warning)",
    hover: "var(--color-warning-hover)",
    color: "#fff",
  },

  "primary-outline": {
    bg: "transparent",
    hover: "var(--color-primary-alpha-12)",
    color: "var(--color-primary)",
    border: "1px solid var(--color-primary)",
  },
  "secondary-outline": {
    bg: "transparent",
    hover: "var(--color-secondary-soft)",
    color: "var(--color-secondary)",
    border: "1px solid var(--color-secondary)",
  },
  "terciary-outline": {
    bg: "transparent",
    hover: "var(--color-terciary-soft)",
    color: "var(--color-terciary)",
    border: "1px solid var(--color-terciary)",
  },
  "warning-outline": {
    bg: "transparent",
    hover: "var(--color-warning-soft)",
    color: "var(--color-warning)",
    border: "1px solid var(--color-warning)",
  },
  "primary-outline-white": {
    bg: "transparent",
    hover: "rgba(255,255,255,0.12)",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.9)",
  },

};

