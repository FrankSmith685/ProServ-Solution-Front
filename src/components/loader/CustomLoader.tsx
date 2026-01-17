import { type FC } from "react";
import { FaUtensils } from "react-icons/fa";
import { CustomImage } from "@/components/ui/media/CustomImage";
import type { CustomLoaderProps } from "@/interfaces/loader/IHomeLoader";

const CustomLoader: FC<CustomLoaderProps> = ({
  message = "Descubriendo huariques cerca de ti",
}) => {
  return (
    <div
      className="
        fixed inset-0 z-9999
        w-screen h-screen
        flex items-center justify-center
        bg-primary-soft
        font-sans
        overflow-hidden
      "
    >
      {/* Fondo decorativo */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(circle_at_top,rgba(255,108,79,0.12),transparent_60%)]
          pointer-events-none
        "
      />

      <div className="relative z-10 flex flex-col items-center gap-6 animate-fade-in-up">
        {/* Logo */}
        <CustomImage
          name="logo_01"
          alt="mappi-logo"
          className="w-52! object-contain"
        />

        {/* Icon animado */}
        <div className="flex items-center gap-2 text-primary">
          <FaUtensils className="animate-bounce text-xl" />
          <span className="text-sm font-medium tracking-wide text-center">
            {message}
          </span>
        </div>

        {/* Línea de carga */}
        <div className="w-24 h-1 rounded-full bg-primary-alpha-12 overflow-hidden">
          <div className="h-full bg-primary animate-[loadLine_1.6s_ease-in-out_infinite]" />
        </div>
      </div>

      <style>
        {`
          @keyframes loadLine {
            0% { width: 0% }
            50% { width: 100% }
            100% { width: 0% }
          }
        `}
      </style>
    </div>
  );
};

export default CustomLoader;
