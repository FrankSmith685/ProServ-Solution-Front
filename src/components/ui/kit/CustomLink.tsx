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
  className
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
      className={className}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",

        fontSize: fontSize ?? {
          xs: "0.9rem",
          md: "1rem",
        },
        fontWeight,
        fontFamily,
        color: styles.color,
        transition: "color 0.2s ease",
        cursor: "pointer",

        "&:hover": {
          color: styles.hoverColor,
        },
      }}
    >
      {icon}
      {text}
    </MuiLink>
  );
};

export const CustomLink = memo(CustomLinkComponent);
