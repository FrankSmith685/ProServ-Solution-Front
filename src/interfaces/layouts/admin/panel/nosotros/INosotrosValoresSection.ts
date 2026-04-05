import type {
  NosotrosFormState,
  NosotrosValueItem,
} from "@/interfaces/page/admin/panel/IAdminNosotros";

export interface NosotrosValoresSectionProps {
  form: NosotrosFormState;
  values: NosotrosValueItem[];
  onTextChange: (
    key: keyof NosotrosFormState
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}