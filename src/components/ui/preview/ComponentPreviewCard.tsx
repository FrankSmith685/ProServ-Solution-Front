import type { FC } from "react";
import type { ComponentPreviewCardProps } from "@/interfaces/ui/preview/IComponentPreviewCardProps";

const ComponentPreviewCard: FC<ComponentPreviewCardProps> = ({
  id,
  label,
  children,
}) => {
  return (
    <section
      data-id={id}
      className="
        rounded-2xl
        bg-white/95
        backdrop-blur-xl
        shadow-[0_20px_60px_rgba(0,0,0,.06)]
        transition-all
        p-6
      "
    >
      {/* HEADER */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-primary tracking-tight">
          {label}
        </h3>

        <p className="text-xs text-gray-500">
          Vista previa del componente
        </p>
      </div>

      {/* CONTENT */}
      <div>
        {children}
      </div>
    </section>
  );
};

export default ComponentPreviewCard;
