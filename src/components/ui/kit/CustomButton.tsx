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
  component,
  to,
  href,
}) => {
  const sizeStyles = {
  lg: `
    h-[52px] text-base px-5
    max-[600px]:h-[44px] max-[600px]:text-sm
    max-[390px]:h-[40px] max-[390px]:text-xs
  `,
  md: `
    h-[44px] text-sm px-4
    max-[600px]:h-[40px] max-[600px]:text-xs
    max-[390px]:h-[38px] max-[390px]:text-xs
  `,
  sm: `
    h-[36px] text-xs px-3
    max-[600px]:h-[34px]
    max-[390px]:h-[32px]
  `,
};
  const iconSize = {
  sm: "w-7 h-7 max-[600px]:w-6 max-[600px]:h-6",
  md: "w-8 h-8 max-[600px]:w-7 max-[600px]:h-7",
  lg: "w-9 h-9 max-[600px]:w-8 max-[600px]:h-8",
};

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
      {...(component ? { component } : {})}
      {...(to ? { to } : {})}
      {...(href ? { href } : {})}
      className={`
        flex items-center justify-center
        font-medium
        transition-all duration-200

        ${fullWidth ? "w-full" : "w-auto"}

        ${
          iconOnly
            ? `${iconSize[size]} rounded-full p-0`
            : `rounded-lg gap-2 ${sizeStyles[size]}`
        }

        ${buttonVariantStyles[variant]}

        ${uppercase ? "uppercase tracking-wide" : ""}
        ${loading ? "opacity-80" : ""}
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-[1.02] active:scale-[0.98]"
        }

        ${className || ""}
      `}
      style={{
        fontFamily: fontFamily ?? "var(--font-primary)",
        fontSize: fontSize,
        fontWeight: fontWeight ?? 600,
      }}
      startIcon={
        loading ? (
          <CircularProgress size={18} color="inherit" />
        ) : !iconOnly && icon ? (
          // 🔥 ICONOS HEREDAN COLOR DEL BOTÓN
          typeof icon === "object"
            ? (icon as React.ReactElement)
            : icon
        ) : null
      }
    //   sx={{
    //   all: "unset",
    // }}
    >
      {iconOnly
        ? // 🔥 ICON ONLY también hereda color
          typeof icon === "object"
          ? (icon as React.ReactElement)
          : icon
        : loading
        ? "Cargando..."
        : text}
    </Button>
  );
};

export const CustomButton = memo(CustomButtonComponent);