import { type FC } from "react";
import { Eye, ScrollText, Shield } from "lucide-react";

import AdminLogsSection from "@/components/layouts/admin/panel/admin-logs/AdminLogsSection";
import AdminPageHeader from "@/components/layouts/admin/panel/AdminPageHeader";
import AdminTabsCard from "@/components/layouts/admin/panel/AdminTabsCard";

export interface AdminLogsTabItem {
  key: "admin-logs";
  label: string;
  description: string;
  icon: typeof ScrollText;
}

const CURRENT_TAB: AdminLogsTabItem = {
  key: "admin-logs",
  label: "Actividad Admin",
  description:
    "Visualiza el historial de acciones realizadas por usuarios administradores dentro del sistema.",
  icon: ScrollText,
};

const AdminLogsPage: FC = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader
        badgeText="Auditoría del sistema"
        badgeIcon={Shield}
        title="Logs administrativos"
        description="Consulta las acciones registradas por los administradores, incluyendo usuario, acción, entidad afectada, IP y fecha."
        activeSectionLabel={CURRENT_TAB.label}
        activeSectionIcon={CURRENT_TAB.icon}
        secondaryAction={{
          text: "Ver sitio",
          icon: <Eye size={16} />,
          component: "a",
          href: "/",
          variant: "secondary-outline",
        }}
      />

      <AdminTabsCard
        title="Módulo de auditoría"
        subtitle="Consulta la trazabilidad de cambios realizados desde el panel administrativo."
        tabs={[CURRENT_TAB]}
        activeTab={CURRENT_TAB.key}
        onChangeTab={() => undefined}
      />

      <section className="space-y-4">
        <AdminLogsSection />
      </section>
    </div>
  );
};

export default AdminLogsPage;