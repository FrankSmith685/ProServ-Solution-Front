import { useContext } from "react";
import { ImagePreloaderContext } from "@/hooks/useImageHooks/ImagePreloaderContext";

export const useImages = () => {
  const ctx = useContext(ImagePreloaderContext);
  if (!ctx) throw new Error("useImages must be used inside ImagePreloaderProvider");
  return ctx;
};
