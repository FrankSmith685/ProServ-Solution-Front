import type { BaseVariant } from "@/shared/design/types";

export type LinkVariantStyle = {
  color: string;
  hoverColor: string;
};

export const linkVariantStyles: Record<BaseVariant, LinkVariantStyle> = {
  primary: {
    color: "var(--color-primary)",
    hoverColor: "var(--color-primary-hover)",
  },
  secondary: {
    color: "var(--color-secondary)",
    hoverColor: "var(--color-secondary-hover)",
  },
  terciary: {
    color: "var(--color-terciary)",
    hoverColor: "var(--color-terciary-hover)",
  },
  warning: {
    color: "var(--color-warning)",
    hoverColor: "var(--color-warning-hover)",
  },
};
