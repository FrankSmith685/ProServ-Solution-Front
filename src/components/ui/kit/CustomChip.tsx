import { Chip } from "@mui/material";
import { memo, type FC, isValidElement } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";

import type { CustomChipProps } from "@/interfaces/ui/kit/ICustomChip";
import { chipVariantStyles } from "@/shared/design/chipVariants";

const CustomChipComponent: FC<CustomChipProps> = ({
  label,
  variant = "primary",
  size = "medium",
  onClick,
  onDelete,
  selected = false,
  clickable = true,
  icon,
  deleteIcon,
  className
}) => {
  const sizeConfig = {
    small: {
      height: 26,
      fontSize: "12px",
      px: 1,
      iconSize: 14,
      deleteIconSize: 12,
    },
    medium: {
      height: 32,
      fontSize: "14px",
      px: 1.5,
      iconSize: 16,
      deleteIconSize: 13,
    },
  };

  const currentSize = sizeConfig[size];
  const currentVariant = chipVariantStyles[variant];

  const safeIcon = isValidElement(icon) ? icon : undefined;
  const safeDeleteIcon = isValidElement(deleteIcon) ? deleteIcon : undefined;

  return (
    <Chip
      className={className}
      label={label}
      clickable={clickable}
      onClick={clickable ? onClick : undefined}
      onDelete={onDelete}
      icon={
        selected ? (
          <FaCheckCircle size={currentSize.iconSize} />
        ) : (
          safeIcon
        )
      }
      deleteIcon={
        onDelete ? (
          safeDeleteIcon ?? <FaTimes size={currentSize.deleteIconSize} />
        ) : undefined
      }
      sx={{
        height: currentSize.height,
        px: currentSize.px,
        borderRadius: "999px",
        fontFamily: "var(--font-primary)",
        fontSize: currentSize.fontSize,
        fontWeight: 500,
        transition: "all 0.2s ease",
        cursor: clickable ? "pointer" : "default",

        backgroundColor: currentVariant.bg,
        color: currentVariant.color,
        border: currentVariant.border,

        boxShadow: selected
          ? `0 0 0 2px ${currentVariant.selectedRing}`
          : "none",

        "&:hover": clickable
          ? {
              backgroundColor: currentVariant.hoverBg,
              transform: "scale(1.05)",
            }
          : undefined,

        "&:active": clickable
          ? {
              transform: "scale(0.97)",
            }
          : undefined,

        "& .MuiChip-label": {
          px: 0.75,
          color: "inherit",
        },

        "& .MuiChip-icon": {
          color: "inherit",
          ml: 0.75,
          mr: -0.15,
        },

        "& .MuiChip-deleteIcon": {
          color: "inherit",
          opacity: 0.8,
          mr: 0.5,
          ml: 0.25,
          "&:hover": {
            opacity: 1,
          },
        },
      }}
    />
  );
};

export const CustomChip = memo(CustomChipComponent);