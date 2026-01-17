import type { Variant } from "@/shared/design/types";

export type ButtonSize = "md" | "lg";

type BaseButtonProps = {
  id?: string;
  onClick?: () => void;
  size?: ButtonSize;
  variant?: Variant;
  icon?: React.ReactNode;
  uppercase?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: number;
  className?: string;
};

export type CustomButtonProps =
  | (BaseButtonProps & {
      iconOnly: true;
      text?: string;
    })
  | (BaseButtonProps & {
      iconOnly?: false;
      text: string;
    });

