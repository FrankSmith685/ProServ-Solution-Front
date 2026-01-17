export type ImageRadius = "none" | "sm" | "md" | "lg" | "xl" | "full";

export interface CustomImageProps {
  name: string;
  alt?: string;

  width?: number | string;
  height?: number | string;

  radius?: ImageRadius;
  shadow?: boolean;
  cover?: boolean;
  className?: string;

  onClick?: () => void;
}

export interface ImageEntry {
    name: string;
    key: string;
}

export interface ImagePreloaderState {
  images: Record<string, string>;
  isLoaded: boolean;
}

export type IdleCallback = (deadline: IdleDeadline) => void;
export interface IdleDeadline {
  didTimeout: boolean;
  timeRemaining: () => number;
}

export interface ImagePreloaderContextType {
  images: Record<string, string>;
  isLoaded: boolean;
}