import { memo, type FC } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { FaSpinner } from "react-icons/fa";
import { useImages } from "@/hooks/useImageHooks/useImages";
import type { CustomImageProps } from "@/interfaces/ui/media/ICustomImage";

const radiusMap = {
  none: "rounded-none",
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

const CustomImageComponent: FC<CustomImageProps> = ({
  name,
  alt,
  width = "auto",
  height = "auto",
  radius = "lg",
  className,
  cover = true,
  onClick
}) => {
  const { images, isLoaded } = useImages();
  const imageSrc = images[name];
  const radiusClass = radiusMap[radius];

  return (
    <div
      onClick={onClick}    
      className={`
        relative overflow-hidden
        ${radiusClass}
        flex items-center justify-center
        ${className ?? ""}
      `}
      style={{ width, height }}
    >
      {(!isLoaded || !imageSrc) && (
        <div className="absolute inset-0 flex items-center justify-center animate-pulse z-10">
          <FaSpinner className="animate-spin text-primary text-3xl" />
        </div>
      )}

      {imageSrc && (
        <LazyLoadImage
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          effect="blur"
          className={`
            transition-opacity duration-500 ease-in-out
            ${isLoaded ? "opacity-100" : "opacity-0"}
            ${cover ? "object-cover" : "object-contain"}
            w-full h-full
          `}
        />
      )}
    </div>
  );
};

export const CustomImage = memo(CustomImageComponent);
