export interface CustomImageViewerImage {
  src: string;
  alt?: string;
}

export interface CustomImageViewerProps {
  images: CustomImageViewerImage[];
  startIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}
