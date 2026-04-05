import { type FC, useState } from "react";
import {
  Eye,
  Mail,
  MessageSquare,
  FileText,
  CalendarCheck,
} from "lucide-react";

import AdminPageHeader from "@/components/layouts/admin/panel/AdminPageHeader";
import AdminTabsCard from "@/components/layouts/admin/panel/AdminTabsCard";

import ContactsSection from "@/components/layouts/admin/panel/contacts/ContactsSection";

import type { AdminContactsTabItem } from "@/interfaces/page/admin/panel/IAdminContacts";
import QuotesSection from "@/components/layouts/admin/panel/contacts/QuotesSection";
import RequestsSection from "@/components/layouts/admin/panel/contacts/RequestsSection";

/* ================= TABS ================= */
type TabKey = "contacts" | "quotes" | "requests";

const TABS: AdminContactsTabItem[] = [
  {
    key: "contacts",
    label: "Contactos",
    description: "Mensajes enviados desde el sitio",
    icon: Mail,
  },
  {
    key: "quotes",
    label: "Cotizaciones",
    description: "Gestión de presupuestos",
    icon: FileText,
  },
  {
    key: "requests",
    label: "Solicitudes",
    description: "Programación de servicios",
    icon: CalendarCheck,
  },
];

const AdminContactsPage: FC = () => {
  const [tab, setTab] = useState<TabKey>("contacts");

  const currentTab = TABS.find((t) => t.key === tab)!;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ================= HEADER ================= */}
      <AdminPageHeader
        badgeText="CRM / Gestión de Clientes"
        badgeIcon={MessageSquare}
        title={currentTab.label}
        description={currentTab.description}
        activeSectionLabel={currentTab.label}
        activeSectionIcon={currentTab.icon}
        secondaryAction={{
          text: "Ver sitio",
          icon: <Eye size={16} />,
          component: "a",
          href: "/contacto",
          variant: "secondary-outline",
        }}
      />

      {/* ================= TABS ================= */}
      <AdminTabsCard
        title="Gestión de clientes"
        subtitle="Administra contactos, cotizaciones y solicitudes."
        tabs={TABS}
        activeTab={tab}
        onChangeTab={(value) => setTab(value as TabKey)}
      />

      {/* ================= CONTENT ================= */}
      <section className="space-y-4">
        {tab === "contacts" && <ContactsSection />}
        {tab === "quotes" && <QuotesSection />}
        {tab === "requests" && <RequestsSection />}
      </section>
    </div>
  );
};

export default AdminContactsPage;