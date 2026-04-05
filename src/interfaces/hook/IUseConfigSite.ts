import type { BasicCallback } from "@/interfaces/helpers/IBasicCallbacks";

export interface CompanyMedia {
  id: string;
  url: string;
  tipo?: string;
  alt?: string;
  tamaño?: number | null;
  created_at?: string;
}

export interface Company {
  id?: string;
  nombre: string;
  razon_social: string;
  ruc: string;
  email: string;
  telefono: string;
  direccion: string;
  logo_media_id?: string | null;
  favicon_media_id?: string | null;
  logo?: CompanyMedia | null;
  favicon?: CompanyMedia | null;
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SiteConfigMap {
  site_name: string;
  site_description: string;
  contact_phone: string;
  contact_email: string;
  whatsapp_url: string;
  facebook_url: string;
  instagram_url: string;
  [key: string]: string;
}

export interface CompanyPayload {
  nombre: string;
  razon_social: string;
  ruc: string;
  email: string;
  telefono: string;
  direccion: string;
  logo_media_id?: string | null;
  favicon_media_id?: string | null;
}

export interface SiteConfigUpdatePayload {
  site_name?: string;
  site_description?: string;
  contact_phone?: string;
  contact_email?: string;
  whatsapp_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  [key: string]: unknown;
}

export interface SiteConfigPayload {
  company: CompanyPayload;
  sitio: SiteConfigUpdatePayload;
}

export interface SiteConfigResponse {
  success: boolean;
  message: string;
  data: SiteConfigMap;
}

export interface CompanyResponse {
  success: boolean;
  message: string;
  data: Company;
}

export interface UseSiteConfig {
  company: Company | null;
  siteConfig: SiteConfigMap;
  loading: boolean;
  saving: boolean;
  getSiteConfiguration: (callback?: BasicCallback) => Promise<void>;
  updateSiteConfiguration: (
    payload: SiteConfigPayload,
    logoFile?: File | null,
    faviconFile?: File | null,
    callback?: BasicCallback
  ) => Promise<void>;
}