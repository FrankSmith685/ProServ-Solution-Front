import type { FC, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface Props {
  icon: ReactNode;
  label: string;
  to?: string;
  danger?: boolean;
  onClick?: () => void;
}

export const UserPanelItem: FC<Props> = ({
  icon,
  label,
  to,
  danger,
  onClick,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (() => {
    if (!to) return false;       // acciones sin navegación
    if (danger) return false;   // acciones peligrosas nunca activas

    return pathname === to || pathname.startsWith(`${to}/`);
  })();

  const handleClick = (): void => {
    if (onClick) {
      onClick();
    }

    if (to) {
      navigate(to);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        w-full flex items-center gap-4
        px-4 py-3 rounded-xl
        cursor-pointer
        border
        transition-all duration-200
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary/40
        ${
          danger
            ? "text-red-500 border-transparent hover:bg-red-50 hover:border-red-200 active:scale-100"
            : isActive
              ? "bg-primary-alpha-10 border-primary text-primary"
              : "text-secondary border-transparent hover:bg-primary-alpha-8 hover:border-primary-alpha-20 active:scale-[0.97]"
        }
      `}
    >
      <span className="text-lg shrink-0">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};
