import type { ReactNode, MouseEvent } from "react";
import type { BaseVariant } from "@/shared/design/types";

export type LinkUnderline = "always" | "hover" | "none";

export interface CustomLinkProps {
  text: string;
  to?: string;
  href?: string;
  variant?: BaseVariant;
  icon?: ReactNode;
  fontSize?: string;
  fontWeight?: number | string;
  fontFamily?: string;
  underline?: LinkUnderline;
  target?: "_blank" | "_self";
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
};
