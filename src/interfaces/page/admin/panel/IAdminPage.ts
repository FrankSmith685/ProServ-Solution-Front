/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { LucideIcon } from "lucide-react";
import type { Contact } from "@/interfaces/hook/IUseContacts";
import type { Testimonial } from "@/interfaces/hook/IUseTestimonials";

export interface DashboardCard {
  icon: LucideIcon;
  label: string;
  value: number;
  link: string;
  badge?: number;
}

export interface RecentContactItem extends Contact {}

export interface AdminPageProps {}

export type ContactStatusVariant =
  | "nuevo"
  | "en_proceso"
  | "otro";

export interface ContactsSummary {
  recientes: Contact[];
  nuevosContactos: number;
}

export interface TestimonialsSummary {
  totalTestimonialsActivos: number;
}

export interface DashboardDataParams {
  servicesCount: number;
  projectsCount: number;
  contactsCount: number;
  testimonialsCount: number;
  nuevosContactos: number;
}

export interface ContactStatusConfig {
  className: string;
  label: string;
}

export type GetContactStatusConfig = (
  estado: Contact["estado"]
) => ContactStatusConfig;

export type BuildDashboardData = (
  params: DashboardDataParams
) => DashboardCard[];

export type SortContactsByDate = (contacts: Contact[]) => Contact[];

export type CountActiveTestimonials = (
  testimonials: Testimonial[]
) => number;