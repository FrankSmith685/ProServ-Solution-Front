import { useEffect, useState } from "react";
import { imageBaseUrl } from "@/api/apiConfig";
import { imageList } from "@/utils/imageUtils";
import type { IdleCallback, ImagePreloaderState } from "@/interfaces/ui/media/ICustomImage";

const CACHE_VERSION = "v2";
let globalCache: Record<string, string> = {};
let globalLoaded = false;

const getInitialCache = (): Record<string, string> => {
  const savedVersion = localStorage.getItem("imageCacheVersion");
  const savedCache = localStorage.getItem("imageCache");

  if (savedCache && savedVersion === CACHE_VERSION) {
    try {
      const parsed: Record<string, string> = JSON.parse(savedCache);
      if (Object.keys(parsed).length > 0) {
        globalCache = parsed;
        globalLoaded = true;
        return parsed;
      }
    } catch {
      localStorage.removeItem("imageCache");
      localStorage.removeItem("imageCacheVersion");
    }
  }
  return {};
};

export const useImagePreloader = (): ImagePreloaderState => {
  const [images, setImages] = useState<Record<string, string>>(getInitialCache);
  const [isLoaded, setIsLoaded] = useState(globalLoaded);

  useEffect(() => {
    let isMounted = true;

    if (globalLoaded) return;

    const loadImages = async () => {
      const loadPromises = imageList.map(({ name, key }) => {
        const src = `${imageBaseUrl}${key}`;
        const img = new Image();
        img.src = src;

        return new Promise<void>((resolve) => {
          img.onload = () => {
            globalCache[name] = src;
            resolve();
          };
          img.onerror = () => resolve();
        });
      });

      await Promise.all(loadPromises);

      if (isMounted) {
        setImages({ ...globalCache });
        setIsLoaded(true);
      }

      localStorage.setItem("imageCache", JSON.stringify(globalCache));
      localStorage.setItem("imageCacheVersion", CACHE_VERSION);
      globalLoaded = true;
    };

    const w = window as unknown as {
      requestIdleCallback?: (cb: IdleCallback) => void;
    };

    if (w.requestIdleCallback) w.requestIdleCallback(loadImages);
    else setTimeout(loadImages, 0);

    return () => {
      isMounted = false;
    };
  }, []);

  return { images, isLoaded };
};
