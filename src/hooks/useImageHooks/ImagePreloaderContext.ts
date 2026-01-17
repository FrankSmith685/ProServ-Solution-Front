import { createContext } from "react";
import type { ImagePreloaderContextType } from "@/interfaces/ui/media/ICustomImage";

export const ImagePreloaderContext =
  createContext<ImagePreloaderContextType | null>(null);
