import { Chip } from "@mui/material";
import { memo, type FC } from "react";
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
}) => {
  const styles = chipVariantStyles[variant];
  const isOutline = variant.includes("outline");

  return (
    <Chip
      label={label}
      size={size}
      clickable={clickable}
      onClick={clickable ? onClick : undefined}
      onDelete={onDelete}
      icon={selected ? <FaCheckCircle size={16} /> : icon}
      deleteIcon={onDelete ? deleteIcon ?? <FaTimes size={14} /> : undefined}
      sx={{
        backgroundColor: styles.bg,
        color: styles.color,
        border: styles.border,
        fontWeight: 500,
        fontFamily: "Arial",
        transition: "all 0.25s ease",
        boxShadow: isOutline ? "none" : "0px 2px 6px rgba(0,0,0,0.12)",

        "&:hover": {
          backgroundColor: styles.hoverBg,
          color: styles.hoverColor ?? styles.color,
          transform: "scale(1.05)",
          boxShadow: isOutline
            ? "0 0 6px rgba(0,0,0,0.05)"
            : "0 4px 10px rgba(0,0,0,0.2)",
        },

        "& .MuiChip-icon": {
          color: "currentColor",
        },

        "& .MuiChip-deleteIcon": {
          color: "currentColor",
          "&:hover": {
            color: styles.hoverColor ?? styles.color,
          },
        },
      }}
    />
  );
};

export const CustomChip = memo(CustomChipComponent);
