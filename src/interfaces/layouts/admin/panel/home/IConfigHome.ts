import type { ConfigMedia } from "@/interfaces/hook/IUseConfigHome";

export interface FormState {
  hero_title: string;
  hero_subtitle: string;
  hero_cta: string;

  services_title: string;
  projects_title: string;

  stats_anos_valor: string;
  stats_proyectos_valor: string;
  stats_clientes_valor: string;
  stats_colaboradores_valor: string;

  about_titulo: string;
  about_descripcion: string;
  about_descripcion2: string;
  about_anos: string;
  about_imagen: string | ConfigMedia | null;

  cta_titulo: string;
  cta_descripcion: string;
}

export type StatFieldKey =
  | "stats_anos_valor"
  | "stats_proyectos_valor"
  | "stats_clientes_valor"
  | "stats_colaboradores_valor";

export interface StatFieldItem {
  key: StatFieldKey;
  label: string;
}