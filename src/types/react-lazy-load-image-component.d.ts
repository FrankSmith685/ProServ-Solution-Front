declare module "react-lazy-load-image-component" {
  import * as React from "react";

  export interface LazyLoadImageProps
    extends React.ImgHTMLAttributes<HTMLImageElement> {
    effect?: "blur" | "opacity" | "black-and-white";
    placeholderSrc?: string;
    scrollPosition?: { x: number; y: number };
    visibleByDefault?: boolean;
    delayTime?: number;
  }

  export const LazyLoadImage: React.FC<LazyLoadImageProps>;
}
