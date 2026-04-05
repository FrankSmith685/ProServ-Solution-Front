import type { ChangeEvent } from "react";
import type { NosotrosFormState } from "@/interfaces/page/admin/panel/IAdminNosotros";

export interface NosotrosHistoriaSectionProps {
  form: NosotrosFormState;
  imageUrl: string | null;
  isHistoryViewerOpen: boolean;
  onTextChange: (
    key: keyof NosotrosFormState
  ) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onImageChange: (url: string | null) => void;
  onImageUpload: (selectedFile: File) => Promise<string>;
  onOpenViewer: () => void;
  onCloseViewer: () => void;
}