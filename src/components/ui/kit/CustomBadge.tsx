import { Chip } from "@mui/material";
import { CheckCircle } from "lucide-react";
import type { ReactNode } from "react";

type Variant = "dark" | "light";

interface CustomBadgeProps {
  children: ReactNode;
  variant?: Variant;
}

export default function CustomBadge({
  children,
  variant = "dark",
}: CustomBadgeProps) {
  const isDark = variant === "dark";

  return (
    <Chip
      label={children}
      icon={<CheckCircle size={16} />}
      sx={{
        backgroundColor: isDark
          ? "rgba(255,255,255,0.08)"
          : "var(--color-primary-soft)",

        color: isDark
          ? "var(--color-on-dark)"
          : "var(--color-primary)",

        backdropFilter: isDark ? "blur(6px)" : "none",

        border: isDark
          ? "1px solid rgba(255,255,255,0.15)"
          : "1px solid var(--color-border)",

        fontWeight: 500,
        px: 1,

        "& .MuiChip-icon": {
          color: isDark
            ? "#4ade80"
            : "var(--color-primary)",
        },

        "&:hover": {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.15)"
            : "var(--color-primary-soft)",
        },
      }}
    />
  );
}