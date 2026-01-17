import type { Variant } from "./types";

export const sidebarItemVariantStyles: Record<
  Variant,
  {
    text: string;
    indicator: string;
    hover: string;
  }
> = {
  primary: {
    text: "text-primary",
    indicator: "bg-primary",
    hover: "hover:text-primary",
  },
  secondary: {
    text: "text-secondary",
    indicator: "bg-secondary",
    hover: "hover:text-secondary",
  },
  terciary: {
    text: "text-terciary",
    indicator: "bg-terciary",
    hover: "hover:text-terciary",
  },
  warning: {
    text: "text-warning",
    indicator: "bg-warning",
    hover: "hover:text-warning",
  },

  /* ---------- Outline ---------- */
  "primary-outline": {
    text: "text-primary",
    indicator: "bg-primary",
    hover: "hover:text-primary",
  },
  "secondary-outline": {
    text: "text-secondary",
    indicator: "bg-secondary",
    hover: "hover:text-secondary",
  },
  "terciary-outline": {
    text: "text-terciary",
    indicator: "bg-terciary",
    hover: "hover:text-terciary",
  },
  "warning-outline": {
    text: "text-warning",
    indicator: "bg-warning",
    hover: "hover:text-warning",
  },
};
