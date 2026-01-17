import type { ImageRadius } from "@/interfaces/ui/media/ICustomImage";

export interface DocumentCustomImageState {
  name: string;
  width: string;
  height: string;
  radius: ImageRadius;
  cover: boolean;
}
