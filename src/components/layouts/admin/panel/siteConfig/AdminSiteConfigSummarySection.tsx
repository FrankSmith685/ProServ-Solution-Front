import type { FC } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock3,
  Globe,
  MessageCircle,
  Facebook,
  Instagram,
} from "lucide-react";

import type { AdminSiteConfigSummarySectionProps } from "@/interfaces/page/admin/panel/IAdminSiteConfig";

const cards = [
  {
    key: "contact_email",
    label: "Correo público",
    icon: Mail,
  },
  {
    key: "contact_phone",
    label: "Teléfono público",
    icon: Phone,
  },
  {
    key: "direccion",
    label: "Dirección",
    icon: MapPin,
  },
  {
    key: "site_name",
    label: "Nombre del sitio",
    icon: Globe,
  },
  {
    key: "whatsapp_url",
    label: "WhatsApp",
    icon: MessageCircle,
  },
  {
    key: "facebook_url",
    label: "Facebook",
    icon: Facebook,
  },
  {
    key: "instagram_url",
    label: "Instagram",
    icon: Instagram,
  },
  {
    key: "telefono",
    label: "Teléfono empresa",
    icon: Clock3,
  },
] as const;

const AdminSiteConfigSummarySection: FC<AdminSiteConfigSummarySectionProps> = ({
  form,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((item) => {
        const Icon = item.icon;
        const value = form[item.key] || "No configurado";

        return (
          <div
            key={item.key}
            className="rounded-[20px] border border-border bg-surface p-4 shadow-sm"
          >
            <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-2 text-primary">
              <Icon className="h-4 w-4" />
            </div>

            <h3 className="font-semibold text-foreground">{item.label}</h3>

            <p className="mt-1 break-all text-sm text-muted-foreground">
              {value}
            </p>
          </div>
        );
      })}

      <div className="rounded-[20px] border border-border bg-surface p-4 shadow-sm md:col-span-2 xl:col-span-4">
        <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-2 text-primary">
          <Globe className="h-4 w-4" />
        </div>

        <h3 className="font-semibold text-foreground">Descripción del sitio</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {form.site_description || "No configurado"}
        </p>
      </div>
    </div>
  );
};

export default AdminSiteConfigSummarySection;