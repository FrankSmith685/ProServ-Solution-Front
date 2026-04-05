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
    color: "var(--color-text-muted)",
    hoverColor: "var(--color-primary)",
  },
};