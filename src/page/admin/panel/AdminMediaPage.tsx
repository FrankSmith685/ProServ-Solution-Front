import { type FC } from "react";
import { Eye, Images } from "lucide-react";

import type { AdminMediaTabItem } from "@/interfaces/page/admin/panel/IAdminMedia";
import AdminPageHeader from "@/components/layouts/admin/panel/AdminPageHeader";
import AdminTabsCard from "@/components/layouts/admin/panel/AdminTabsCard";
import MediaSection from "@/components/layouts/admin/media/MediaSection";

const CURRENT_TAB: AdminMediaTabItem = {
  key: "media",
  label: "Media",
  description:
    "Gestiona imágenes y archivos subidos al sistema, incluyendo vista previa, carpeta, tipo, fecha y eliminación.",
  icon: Images,
};

const AdminMediaPage: FC = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader
        badgeText="Administración de media"
        badgeIcon={Images}
        title="Gestión de Medias"
        description="Visualiza, filtra y elimina archivos multimedia registrados en el sistema desde una interfaz clara y consistente."
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
        title="Biblioteca multimedia"
        subtitle="Administra archivos e imágenes registradas en la plataforma."
        tabs={[CURRENT_TAB]}
        activeTab={CURRENT_TAB.key}
        onChangeTab={() => undefined}
      />

      <section className="space-y-4">
        <MediaSection />
      </section>
    </div>
  );
};

export default AdminMediaPage;