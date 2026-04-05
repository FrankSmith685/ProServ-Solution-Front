import { BookOpen, Gem, Target } from "lucide-react";

import type {
  AdminNosotrosTabItem,
  NosotrosFormState,
  NosotrosValueItem,
} from "@/interfaces/page/admin/panel/IAdminNosotros";

export const ADMIN_NOSOTROS_TABS: AdminNosotrosTabItem[] = [
  {
    key: "historia",
    label: "Historia",
    icon: BookOpen,
    description: "Edita la historia principal e imagen de la empresa.",
  },
  {
    key: "misionVision",
    label: "Misión y Visión",
    icon: Target,
    description: "Gestiona la esencia y dirección estratégica de la marca.",
  },
  {
    key: "valores",
    label: "Valores",
    icon: Gem,
    description: "Actualiza los valores corporativos visibles en la página.",
  },
];

export const INITIAL_NOSOTROS_FORM: NosotrosFormState = {
  historia_titulo: "",
  historia_p1: "",
  historia_p2: "",
  historia_p3: "",
  historia_imagen: "",

  mision: "",
  vision: "",

  valor_1_titulo: "",
  valor_1_desc: "",
  valor_2_titulo: "",
  valor_2_desc: "",
  valor_3_titulo: "",
  valor_3_desc: "",
  valor_4_titulo: "",
  valor_4_desc: "",
};

export const NOSOTROS_VALUE_FIELDS: NosotrosValueItem[] = [
  { index: 1, titleKey: "valor_1_titulo", descKey: "valor_1_desc" },
  { index: 2, titleKey: "valor_2_titulo", descKey: "valor_2_desc" },
  { index: 3, titleKey: "valor_3_titulo", descKey: "valor_3_desc" },
  { index: 4, titleKey: "valor_4_titulo", descKey: "valor_4_desc" },
];