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
  "primary-outline-white": {
    text: "text-white",
    indicator: "bg-white",
    hover: "hover:text-white",
  },
};
