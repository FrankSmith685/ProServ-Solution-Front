import {
  BadgeInfo,
  Globe,
  Image as ImageIcon,
  LayoutDashboard,
} from "lucide-react";

import type {
  AdminSiteConfigTabItem,
  SiteConfigFormState,
  ConfigFieldItem,
} from "@/interfaces/page/admin/panel/IAdminSiteConfig";

export const INITIAL_SITE_CONFIG_FORM: SiteConfigFormState = {
  nombre: "",
  razon_social: "",
  ruc: "",
  email: "",
  telefono: "",
  direccion: "",

  site_name: "",
  site_description: "",
  contact_phone: "",
  contact_email: "",
  whatsapp_url: "",
  facebook_url: "",
  instagram_url: "",

  logo_media_id: null,
  favicon_media_id: null,
  logo: null,
  favicon: null,
};

export const ADMIN_SITE_CONFIG_TABS: AdminSiteConfigTabItem[] = [
  {
    key: "empresa",
    label: "Empresa",
    description: "Datos institucionales base.",
    icon: BadgeInfo,
  },
  {
    key: "sitio",
    label: "Sitio",
    description: "Contenido público y enlaces globales.",
    icon: Globe,
  },
  {
    key: "branding",
    label: "Branding",
    description: "Logo y favicon del sitio.",
    icon: ImageIcon,
  },
  {
    key: "resumen",
    label: "Resumen",
    description: "Vista rápida de la configuración actual.",
    icon: LayoutDashboard,
  },
];

export const SITE_CONFIG_COMPANY_FIELDS: ConfigFieldItem[] = [
  {
    key: "nombre",
    label: "Nombre comercial",
    placeholder: "Ingrese el nombre comercial",
  },
  {
    key: "razon_social",
    label: "Razón social",
    placeholder: "Ingrese la razón social",
  },
  {
    key: "ruc",
    label: "RUC",
    placeholder: "Ingrese el RUC",
  },
  {
    key: "email",
    label: "Correo corporativo",
    placeholder: "Ingrese el correo corporativo",
    type: "email",
  },
  {
    key: "telefono",
    label: "Teléfono",
    placeholder: "Ingrese el teléfono principal",
  },
  {
    key: "direccion",
    label: "Dirección",
    placeholder: "Ingrese la dirección de la empresa",
  },
];

export const SITE_CONFIG_PUBLIC_FIELDS: ConfigFieldItem[] = [
  {
    key: "site_name",
    label: "Nombre del sitio",
    placeholder: "Ej. ServicioPro",
  },
  {
    key: "site_description",
    label: "Descripción del sitio",
    placeholder: "Describe brevemente el sitio",
    type: "textarea",
  },
  {
    key: "contact_phone",
    label: "Teléfono público",
    placeholder: "Ej. +51 999 999 999",
  },
  {
    key: "contact_email",
    label: "Correo público",
    placeholder: "Ej. info@empresa.com",
    type: "email",
  },
  {
    key: "whatsapp_url",
    label: "URL de WhatsApp",
    placeholder: "https://wa.me/51999999999",
    type: "url",
  },
  {
    key: "facebook_url",
    label: "URL de Facebook",
    placeholder: "https://facebook.com/tu-pagina",
    type: "url",
  },
  {
    key: "instagram_url",
    label: "URL de Instagram",
    placeholder: "https://instagram.com/tu-cuenta",
    type: "url",
  },
];