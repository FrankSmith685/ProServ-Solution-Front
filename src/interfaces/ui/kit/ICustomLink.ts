import type { ReactNode, MouseEvent } from "react";
import type { BaseVariant } from "@/shared/design/types";
import type { SxProps, Theme } from "@mui/material";

export type LinkUnderline = "always" | "hover" | "none";

export interface CustomLinkProps {
  text: ReactNode;
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
  sx?: SxProps<Theme>;
};
