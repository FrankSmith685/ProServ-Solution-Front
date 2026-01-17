import type { FC } from "react";
import { sidebarItemVariantStyles } from "@/shared/design/sidebarItemVariants";
import type { ICustomSidebarItemProps } from "@/interfaces/ui/kit/ICustomSidebarItem";

const CustomSidebarItem: FC<ICustomSidebarItemProps> = ({
  label,
  active = false,
  disabled = false,
  variant = "primary",
  size = "md",
  onClick,
}) => {
  const styles = sidebarItemVariantStyles[variant];

  return (
    <li
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onClick?.();
      }}
      className={`
        group relative flex items-center select-none
        ${size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
        transition-colors duration-75
        ${active ? `${styles.text} font-semibold` : `text-secondary ${styles.hover}`}
      `}
    >
      <span
        className={`
          absolute left-0 top-1/2 -translate-y-1/2
          h-4 w-0.75 rounded-r-full
          transition-opacity duration-75
          ${
            active
              ? `${styles.indicator} opacity-100`
              : `${styles.indicator} opacity-0 group-hover:opacity-40`
          }
        `}
      />
      {label}
    </li>
  );
};


export default CustomSidebarItem;
