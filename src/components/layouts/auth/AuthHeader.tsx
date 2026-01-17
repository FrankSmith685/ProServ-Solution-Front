import { type FC } from "react";
import { CustomImage } from "../../ui/media/CustomImage";
import { useNavigate } from "react-router-dom";

export const AuthHeader: FC = () => {
  const navigate= useNavigate();
  return (
    <div className="bg-white flex items-center justify-center w-full h-20 z-20 relative">
      <CustomImage
        name="logo_01"
        alt="mappi-logo"
        className="object-contain transition-all duration-300 w-37.5! h-full! cursor-pointer"
        onClick={()=>navigate("/")}
      />
    </div>
  );
};
