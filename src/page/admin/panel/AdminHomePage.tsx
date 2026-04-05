import { useMemo, useState, type FC } from "react";
import {
  Eye,
  Home,
  LayoutPanelTop,
  Settings2,
} from "lucide-react";

import HeroSlidesSection from "@/components/layouts/admin/panel/home/HeroSlidesSection";
import ConfigHomeSection from "@/components/layouts/admin/panel/home/ConfigHomeSection";

// import AdminPageHeader from "@/components/ui/admin/AdminPageHeader";
// import AdminTabsCard from "@/components/ui/admin/AdminTabsCard";

import type {
  AdminHomeTab,
  AdminTabItem,
} from "@/interfaces/page/admin/panel/IAdminHome";
import AdminPageHeader from "@/components/layouts/admin/panel/AdminPageHeader";
import AdminTabsCard from "@/components/layouts/admin/panel/AdminTabsCard";

const TABS: AdminTabItem[] = [
  {
    key: "slides",
    label: "Hero",
    description:
      "Gestiona los slides principales que aparecen al ingresar al sitio.",
    icon: LayoutPanelTop,
  },
  {
    key: "config",
    label: "Configuración",
    description:
      "Edita títulos, estadísticas, bloque about y CTA del home.",
    icon: Settings2,
  },
];

const AdminHome: FC = () => {
  const [tab, setTab] = useState<AdminHomeTab>("slides");

  const currentTab = useMemo<AdminTabItem>(() => {
    return TABS.find((item) => item.key === tab) ?? TABS[0];
  }, [tab]);

  const renderContent = (): React.ReactNode => {
    switch (tab) {
      case "slides":
        return <HeroSlidesSection />;

      case "config":
        return <ConfigHomeSection />;

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader
        badgeText="Administración del Home"
        badgeIcon={Home}
        title="Página de Inicio"
        description="Gestiona el contenido visual y la configuración general del home desde una interfaz más clara, moderna y consistente con el resto del panel administrativo."
        activeSectionLabel={currentTab.label}
        activeSectionIcon={currentTab.icon}
        secondaryAction={{
          text: "Ver sitio",
          icon: <Eye size={16} />,
          component: "a",
          href: "/",
          variant: "secondary-outline",
        }}
      />

      <AdminTabsCard
        title="Módulos del Home"
        subtitle="Cambia entre la gestión del hero y la configuración general."
        tabs={TABS}
        activeTab={tab}
        onChangeTab={setTab}
      />

      <section className="space-y-4">{renderContent()}</section>
    </div>
  );
};

export default AdminHome;