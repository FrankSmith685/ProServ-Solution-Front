import { CustomImage } from "@/components/ui/media/CustomImage";
import { FaSpinner } from "react-icons/fa";

export const AuthPageSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row 2xl:flex-col min-h-screen font-sans w-full">

      {/* Panel izquierdo REAL */}
      <div className="
        bg-primary-gradient text-white flex items-center justify-center
        w-full h-20
        lg:w-112.5 lg:h-screen lg:rounded-tr-[200px]
        2xl:w-full 2xl:h-30 2xl:rounded-none
      ">
        <CustomImage
          name="logo_02"
          alt="mappi-logo"
          className="object-contain w-37.5! lg:w-62.5! 2xl:w-38 h-full! transition-all"
        />
      </div>

      {/* Panel derecho */}
      <div className="w-full flex-1 flex items-center justify-center responsive-padding">
        <div className="
          w-full max-w-125 bg-white shadow-lg rounded-2xl
          border border-primary-alpha-12 px-6 py-10
          flex flex-col gap-6 items-center text-center
        ">
          <FaSpinner className="text-primary text-4xl animate-spin" />
          <h3 className="text-2xl font-bold text-secondary">
            Preparando tu experiencia
          </h3>
          <p className="text-terciary max-w-80">
            Estamos cargando los recursos necesarios para ofrecerte
            una experiencia rápida y segura.
          </p>

          <div className="w-full max-w-80 h-2 bg-secondary-soft rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-[loadBar_1.2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>

      <style>
        {`
        @keyframes loadBar {
          0% { width: 0% }
          50% { width: 80% }
          100% { width: 0% }
        }
      `}
      </style>
    </div>
  );
};
