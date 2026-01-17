import type { BaseVariant } from "@/shared/design/types";

export const variantClasses: Record<BaseVariant, string> = {
  primary: "bg-primary-soft text-primary border-primary",
  secondary: "bg-secondary-soft text-secondary border-secondary",
  terciary: "bg-terciary-soft text-terciary border-terciary",
  warning: "bg-warning-soft text-warning border-warning",
};
