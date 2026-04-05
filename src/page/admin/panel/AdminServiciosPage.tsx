import { type FC } from "react";
import { Eye, Wrench, Shapes } from "lucide-react";

// import ServicesSection from "@/components/layouts/admin/panel/services/ServicesSection";
import type { AdminServicesTabItem } from "@/interfaces/page/admin/panel/IAdminService";
import AdminPageHeader from "@/components/layouts/admin/panel/AdminPageHeader";
import AdminTabsCard from "@/components/layouts/admin/panel/AdminTabsCard";
import ServicesSection from "@/components/layouts/admin/panel/services/ServicesSection";


const CURRENT_TAB: AdminServicesTabItem = {
  key: "services",
  label: "Servicios",
  description:
    "Gestiona los servicios visibles en el sitio, incluyendo imagen, ícono, orden y estado.",
  icon: Shapes,
};

const AdminServicesPage: FC = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader
        badgeText="Administración de Servicios"
        badgeIcon={Wrench}
        title="Servicios"
        description="Gestiona la información, imágenes, íconos, estado y orden de los servicios desde una interfaz consistente con el resto del panel."
        activeSectionLabel={CURRENT_TAB.label}
        activeSectionIcon={CURRENT_TAB.icon}
        secondaryAction={{
          text: "Ver sitio",
          icon: <Eye size={16} />,
          component: "a",
          href: "/servicios",
          variant: "secondary-outline",
        }}
      />

      <AdminTabsCard
        title="Módulo de administración"
        subtitle="Gestiona el catálogo de servicios visibles en el sitio."
        tabs={[CURRENT_TAB]}
        activeTab={CURRENT_TAB.key}
        onChangeTab={() => undefined}
      />

      <section className="space-y-4">
        <ServicesSection />
      </section>
    </div>
  );
};

export default AdminServicesPage;