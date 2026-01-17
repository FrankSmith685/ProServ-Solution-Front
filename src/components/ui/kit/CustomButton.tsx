import { Button, CircularProgress } from "@mui/material";
import { memo, type FC } from "react";
import { buttonVariantStyles } from "@/shared/design/buttonVariants";
import type { CustomButtonProps } from "@/interfaces/ui/kit/ICustomButton";

const CustomButtonComponent: FC<CustomButtonProps> = ({
  id,
  text,
  onClick,
  size = "lg",
  variant = "primary",
  icon,
  uppercase = false,
  fullWidth = false,
  disabled = false,
  loading = false,
  type = "button",
  ariaLabel,
  fontSize,
  fontFamily,
  fontWeight,
  className,
  iconOnly,
}) => {
  const styles = buttonVariantStyles[variant];

  const sizeConfig = {
    lg: {
      height: "clamp(48px, 6vw, 52px)",
      fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
      padding: "0 clamp(16px, 4vw, 20px)",
    },
    md: {
      height: "clamp(40px, 6vw, 44px)",
      fontSize: "clamp(0.95rem, 2.5vw, 1rem)",
      padding: "0 clamp(14px, 4vw, 18px)",
    },
  };

  const currentSize = sizeConfig[size];

  return (
    <Button
      id={id}
      type={type}
      onClick={onClick}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      variant="text"
      color="inherit"
      disableElevation
      disableRipple
      className={`
        transition-all flex items-center justify-center
        ${iconOnly ? "rounded-full min-w-0! p-0! h-9! w-9! gap-0" : "rounded-md gap-2"}
        ${className || ""}
      `}
      sx={{
        height: iconOnly ? 36 : currentSize.height,
        width: iconOnly ? 36 : undefined,
        padding: iconOnly ? 0 : currentSize.padding,
        minWidth: 0,

        fontWeight: fontWeight ?? 600,
        fontSize: fontSize ?? currentSize.fontSize,
        fontFamily: fontFamily ?? "arial",
        textTransform: uppercase ? "uppercase" : "none",

        backgroundColor: styles.bg,
        color: styles.color,
        border: styles.border,

        "&:hover": { backgroundColor: styles.hover },
        "&.Mui-disabled": {
          backgroundColor: "#e0e0e0",
          color: "#9e9e9e",
        },
      }}
      startIcon={
        loading ? (
          <CircularProgress size={18} color="inherit" />
        ) : (!iconOnly ? icon : null)
      }
    >
      {iconOnly ? icon : loading ? "Cargando..." : text}
    </Button>
  );
};

export const CustomButton = memo(CustomButtonComponent);
