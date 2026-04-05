import { Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { memo, type FC } from "react";
import type { CustomLinkProps } from "@/interfaces/ui/kit/ICustomLink";
import { linkVariantStyles } from "@/shared/design/linkVariants";

const CustomLinkComponent: FC<CustomLinkProps> = ({
  to,
  href,
  text,
  icon,
  variant = "primary",
  fontSize,
  fontWeight = 500,
  fontFamily = "Arial",
  underline = "hover",
  target = "_self",
  onClick,
  className,
  sx
}) => {
  const styles = linkVariantStyles[variant];

  const linkProps = {
    component: to ? RouterLink : "a",
    to,
    href,
    target,
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.stopPropagation();
      onClick?.(e);
    },
  };

  return (
    <MuiLink
      {...linkProps}
      underline={underline}
      className={`
        inline-flex items-center gap-1
        transition-colors duration-200 cursor-pointer
        ${className ?? ""}
      `}
      sx={{
        fontSize: fontSize ?? {
          xs: "0.9rem",
          md: "1rem",
        },
        fontWeight,
        fontFamily,
        color: styles.color,
        "&:hover": {
          color: styles.hoverColor,
        },
        ...sx,
      }}
    >
      {icon}
      {text}
    </MuiLink>
  );
};

export const CustomLink = memo(CustomLinkComponent);
