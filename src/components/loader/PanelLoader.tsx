import { CustomImage } from "@/components/ui/media/CustomImage";
import type { FC } from "react";
import { FaSpinner } from "react-icons/fa";

type PanelLoaderProps = {
  message?: string;
};

export const PanelLoader: FC<PanelLoaderProps> = ({
  message = "Preparando tu panel…",
}) => {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-terciary-soft">
      <div className="flex flex-col items-center gap-4 animate-fade-in-up">
        <CustomImage
          name="logo_01"
          alt="mappi-logo"
          className="w-36 object-contain opacity-90"
        />

        <FaSpinner className="text-primary text-lg animate-spin" />

        <span className="text-sm text-terciary tracking-wide">
          {message}
        </span>
      </div>
    </div>
  );
};
