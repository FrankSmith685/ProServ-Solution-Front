import type { ReactNode } from "react";
import type { Variant } from "@/shared/design/types";

export interface CustomCardProps {
  title?: string;
  description?: string;
  variant?: Variant;
  headerExtra?: ReactNode;
  children?: ReactNode;
  hoverable?: boolean;
  fullWidth?: boolean;
}
