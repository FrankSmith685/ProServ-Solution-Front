export interface HomeCtaPhoneItem {
  number: string;
  href: string;
  variant: "primary" | "secondary";
}

export interface HomeStatItem {
  value: number;
  suffix?: string;
  label: string;
}

export interface HomeAboutItem {
  title: string;
  subtitle: string;
  description: string;
  secondaryDescription: string;
  image: string;
  badgeText: string;
  badgeValue: string;
  points: string[];
}

export interface HomeHeroSlideItem {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaPath: string;
  image: string;
  badge: string;
  activo: boolean;
}

export interface HomeServiceItem {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  image_url: string | null;
  activo: boolean;
}

export interface HomeTestimonialItem {
  id: string;
  nombre: string;
  cargo: string | null;
  empresa: string | null;
  testimonio: string;
  calificacion: number;
  foto: string | null;
  activo: boolean;
}

/**
 * Este tipo lo puedes usar si quieres tipar mejor configHome
 * en tu hook o en tu estado global.
 */
export interface HomeConfigStatsFields {
  stats_1_value?: number | string | null;
  stats_1_suffix?: string | null;
  stats_1_label?: string | null;

  stats_2_value?: number | string | null;
  stats_2_suffix?: string | null;
  stats_2_label?: string | null;

  stats_3_value?: number | string | null;
  stats_3_suffix?: string | null;
  stats_3_label?: string | null;

  stats_4_value?: number | string | null;
  stats_4_suffix?: string | null;
  stats_4_label?: string | null;
}