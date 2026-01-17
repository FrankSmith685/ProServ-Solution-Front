import { CustomImage } from "@/components/ui/media/CustomImage";
import type { AuthLoaderProps } from "@/interfaces/loader/IAuthLoader";
import { FaSpinner } from "react-icons/fa";


export const AuthLoader = ({
  message = "Preparando todo para ti",
}: AuthLoaderProps) => {
  return (
    <div
      className="
        fixed inset-0 z-9999
        w-screen h-screen
        flex items-center justify-center
        bg-white
        font-sans
        overflow-hidden
      "
    >
      {/* detalle visual sutil */}
      <div
        className="
          absolute inset-0
          pointer-events-none
          bg-[radial-gradient(circle_at_center,rgba(255,108,79,0.06),transparent_55%)]
        "
      />

      <div
        className="
          relative z-10
          flex flex-col items-center gap-5
          animate-fade-in-up
        "
      >
        {/* Logo */}
        <CustomImage
          name="logo_01"
          alt="mappi-logo"
          className="w-60! object-contain"
        />

        {/* Accent line */}
        <div className="w-14 h-0.5 rounded-full bg-primary-alpha-16 overflow-hidden">
          <div className="h-full bg-primary animate-[loadLine_1.6s_ease-in-out_infinite]" />
        </div>

        {/* Spinner */}
        <FaSpinner className="text-primary text-lg animate-spin" />

        {/* Texto */}
        <span className="text-sm text-terciary tracking-wide text-center">
          {message}
        </span>
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
