import type { NosotrosFormState } from "@/interfaces/page/admin/panel/IAdminNosotros";

export interface NosotrosMisionVisionSectionProps {
  form: NosotrosFormState;
  onTextChange: (
    key: keyof NosotrosFormState
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}