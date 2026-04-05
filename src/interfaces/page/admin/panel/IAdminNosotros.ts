import type { ConfigNosotrosMedia } from "@/interfaces/hook/IUseConfigNosotros";
import type { AdminPanelTabItem } from "@/interfaces/layouts/admin/panel/IAdminPageShell";

export type AdminNosotrosTab = "historia" | "misionVision" | "valores";
export type AdminNosotrosTabItem = AdminPanelTabItem<AdminNosotrosTab>;

export interface NosotrosFormState {
  historia_titulo: string;
  historia_p1: string;
  historia_p2: string;
  historia_p3: string;
  historia_imagen: string | ConfigNosotrosMedia;

  mision: string;
  vision: string;

  valor_1_titulo: string;
  valor_1_desc: string;
  valor_2_titulo: string;
  valor_2_desc: string;
  valor_3_titulo: string;
  valor_3_desc: string;
  valor_4_titulo: string;
  valor_4_desc: string;
}

export type NosotrosValorTitleKey =
  | "valor_1_titulo"
  | "valor_2_titulo"
  | "valor_3_titulo"
  | "valor_4_titulo";

export type NosotrosValorDescKey =
  | "valor_1_desc"
  | "valor_2_desc"
  | "valor_3_desc"
  | "valor_4_desc";

export interface NosotrosValueItem {
  index: 1 | 2 | 3 | 4;
  titleKey: NosotrosValorTitleKey;
  descKey: NosotrosValorDescKey;
}