import type { ReactNode } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
} from "react-icons/fa";
import type { BaseVariant } from "./types";

export const defaultVariantIcons: Record<BaseVariant, ReactNode> = {
  primary: <FaCheckCircle size={20} />,
  secondary: <FaInfoCircle size={20} />,
  terciary: <FaInfoCircle size={20} />,
  warning: <FaExclamationCircle size={20} />,
};

