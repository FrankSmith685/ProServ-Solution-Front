import type { ChangeEvent } from "react";
import type { ConfigNosotrosMedia } from "@/interfaces/hook/IUseConfigNosotros";
import type {
  AdminNosotrosTab,
  NosotrosFormState,
} from "@/interfaces/page/admin/panel/IAdminNosotros";

export interface AdminNosotrosPageState {
  tab: AdminNosotrosTab;
  form: NosotrosFormState;
  file: File | null;
  imageUrl: string | null;
  initialMediaId: string | null;
  isHistoryViewerOpen: boolean;
}

export interface AdminNosotrosTextChangeHandler {
  (
    key: keyof NosotrosFormState
  ): (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export interface AdminNosotrosChangeHandler {
  <K extends keyof NosotrosFormState>(
    key: K,
    value: NosotrosFormState[K]
  ): void;
}

export interface NosotrosMediaHelpers {
  toStr: (value: unknown) => string;
  getMediaObject: (value: unknown) => ConfigNosotrosMedia | null;
  getMediaUrl: (value: unknown) => string | null;
}