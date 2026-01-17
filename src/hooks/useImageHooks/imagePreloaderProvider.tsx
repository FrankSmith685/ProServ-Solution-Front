import type { ReactNode } from "react";
import { ImagePreloaderContext } from "./ImagePreloaderContext";
import { useImagePreloader } from "./useImagePreloader";

export const ImagePreloaderProvider = ({ children }: { children: ReactNode }) => {
  const { images, isLoaded } = useImagePreloader();

  return (
    <ImagePreloaderContext.Provider value={{ images, isLoaded }}>
      {children}
    </ImagePreloaderContext.Provider>
  );
};
