import { type FC } from "react";
import { CustomImage } from "@/components/ui/media/CustomImage";
import type { AuthLayoutProps } from "@/interfaces/layouts/IAuthLayout";
import { useNavigate } from "react-router-dom";

export const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col lg:flex-row 2xl:flex-col min-h-screen font-sans w-full">
      <div
        className="
          bg-primary-gradient text-white flex items-center justify-center
          w-full h-20
          lg:w-112.5 lg:h-screen lg:rounded-tr-[200px]
          2xl:w-full 2xl:h-30 2xl:rounded-none
        "
      >
        <CustomImage
          name="logo_02"
          alt="mappi-logo"
          className="
            object-contain transition-all duration-300
            w-37.5! lg:w-62.5! 2xl:w-38 h-full!
          "
          onClick={()=>navigate("/")}
        />
      </div>

      <div className="w-full flex-1 flex items-center justify-center responsive-padding">
        <div className="w-full max-w-125 flex flex-col gap-4">
          {children}
        </div>
      </div>
    </div>
  );
};
