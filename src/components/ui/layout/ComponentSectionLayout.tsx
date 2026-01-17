import { memo, type FC } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import type { SectionLayoutProps } from "@/interfaces/ui/layout/IComponentSectionLayout";

const ComponentSectionLayout: FC<SectionLayoutProps> = ({
  title,
  subTitle,
  children,
  menuOpen = false,
  onToggleMenu,
  onBack,
}) => (
  <div className="w-full">
    <header
      className="
        flex flex-col gap-4
        md:flex-row md:items-center md:justify-between
        mb-6
        rounded-2xl
        border border-white/60
        bg-linear-to-br from-white/95 to-primary/10
        backdrop-blur-md
        shadow-[0_10px_30px_rgba(0,0,0,.06)]
        px-4 py-4 md:px-6
      "
    >
      <div className="flex items-center gap-3">
        {onToggleMenu && (
          <button
            onClick={onToggleMenu}
            className="
              lg:hidden
              rounded-lg
              p-2
              border border-white/60
              bg-white/70
              hover:bg-primary/20
              transition
              text-gray-700
            "
          >
            {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        )}

        <div className="flex flex-col">
          <h3
            className="
              text-gray-900
              text-xl
              md:text-2xl
              font-bold
              leading-tight
            "
          >
            {title}
          </h3>

          {subTitle && (
            <span className="text-sm text-gray-600">
              {subTitle}
            </span>
          )}
        </div>
      </div>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="
            self-start md:self-auto
            flex items-center gap-1
            text-sm
            text-primary
            hover:text-primary/80
            transition
          "
        >
          <FiArrowLeft className="text-lg" />
          Atrás
        </button>
      )}
    </header>

    {children}
  </div>
);

export const SectionLayout = memo(ComponentSectionLayout);
