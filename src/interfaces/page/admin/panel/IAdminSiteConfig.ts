import type { LucideIcon } from "lucide-react";

export interface SiteConfigMediaValue {
  id: string;
  url: string;
}

export interface SiteConfigFormState {
  nombre: string;
  razon_social: string;
  ruc: string;
  email: string;
  telefono: string;
  direccion: string;

  site_name: string;
  site_description: string;
  contact_phone: string;
  contact_email: string;
  whatsapp_url: string;
  facebook_url: string;
  instagram_url: string;

  logo_media_id: string | null;
  favicon_media_id: string | null;
  logo: SiteConfigMediaValue | null;
  favicon: SiteConfigMediaValue | null;
}

export type AdminSiteConfigTab =
  | "empresa"
  | "sitio"
  | "branding"
  | "resumen";

export interface AdminSiteConfigTabItem {
  key: AdminSiteConfigTab;
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface ConfigFieldItem {
  key: keyof SiteConfigFormState;
  label: string;
  placeholder: string;
  type?: "text" | "email" | "url" | "textarea";
}

export interface AdminSiteConfigCompanySectionProps {
  form: SiteConfigFormState;
  fields: ConfigFieldItem[];
  onChange: (
    key: keyof SiteConfigFormState
  ) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export interface AdminSiteConfigPublicSectionProps {
  form: SiteConfigFormState;
  fields: ConfigFieldItem[];
  onChange: (
    key: keyof SiteConfigFormState
  ) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}


export interface AdminSiteConfigBrandingSectionProps {
  logo: SiteConfigMediaValue | null;
  favicon: SiteConfigMediaValue | null;
  isLogoViewerOpen: boolean;
  isFaviconViewerOpen: boolean;

  onLogoChange: (url: string | null) => void;
  onFaviconChange: (url: string | null) => void;

  onLogoUpload: (file: File) => Promise<string>;
  onFaviconUpload: (file: File) => Promise<string>;

  onRemoveLogo: () => void;
  onRemoveFavicon: () => void;

  onOpenLogoViewer: () => void;
  onCloseLogoViewer: () => void;
  onOpenFaviconViewer: () => void;
  onCloseFaviconViewer: () => void;
}

export interface AdminSiteConfigSummarySectionProps {
  form: SiteConfigFormState;
}