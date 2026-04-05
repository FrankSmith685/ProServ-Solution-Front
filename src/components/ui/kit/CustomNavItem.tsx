import { Link } from "react-router-dom";
import type { FC } from "react";
import { sidebarItemVariantStyles } from "@/shared/design/sidebarItemVariants";

interface Props {
  label: string;
  to: string;
  active?: boolean;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

const CustomNavItem: FC<Props> = ({
  label,
  to,
  active = false,
  variant = "primary",
  onClick,
}) => {
  const styles = sidebarItemVariantStyles[variant];

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        group relative flex items-center justify-between
        px-4 py-3 rounded-xl
        transition-all duration-150

        ${
          active
            ? `${styles.text} font-semibold`
            : `text-secondary ${styles.hover}`
        }
      `}
    >
      <span>{label}</span>

      {/* Arrow */}
      <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
        →
      </span>

      {/* Indicator */}
      <span
        className={`
          absolute left-0 top-1/2 -translate-y-1/2
          h-4 w-0.75 rounded-r-full
          ${
            active
              ? `${styles.indicator} opacity-100`
              : `${styles.indicator} opacity-0 group-hover:opacity-40`
          }
        `}
      />
    </Link>
  );
};

export default CustomNavItem;