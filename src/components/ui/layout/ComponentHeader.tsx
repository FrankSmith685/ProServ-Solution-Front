import { FiMenu } from "react-icons/fi";
import type { FC, JSX } from "react";
import type { IComponentHeaderProps } from "@/interfaces/ui/layout/IComponentHeader";

const ComponentHeader: FC<IComponentHeaderProps> = ({
  title,
  subtitle,
  onMenuClick,
}): JSX.Element => {
  return (
    <header
      className="
        fixed top-0 z-30 w-full
        backdrop-blur bg-white/80
        border-b border-primary-alpha-8
        shadow-sm shadow-black/5
      "
    >
      <div
        className="
          h-20
          flex items-center justify-between
          px-4 md:px-8
        "
      >
        <div className="space-y-0.5">
          <h1
            className="
              text-xl md:text-2xl
              font-bold
              text-primary
              tracking-tight
            "
          >
            {title}
          </h1>

          {subtitle && (
            <p className="text-sm text-terciary">
              {subtitle}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onMenuClick}
          className="
            lg:hidden
            inline-flex items-center justify-center
            w-10 h-10
            rounded-xl
            text-primary
            hover:bg-primary-alpha-8
            active:bg-primary-alpha-12
            transition-colors
            cursor-pointer
          "
        >
          <FiMenu size={22} />
        </button>

      </div>
    </header>
  );
};

export default ComponentHeader;
