import { type FC } from "react";
import { Eye, MessageSquareQuote, Star } from "lucide-react";

import TestimonialsSection from "@/components/layouts/admin/panel/testimonials/TestimonialsSection";
import AdminPageHeader from "@/components/layouts/admin/panel/AdminPageHeader";
import AdminTabsCard from "@/components/layouts/admin/panel/AdminTabsCard";
import type { AdminTestimonialsTabItem } from "@/interfaces/page/admin/panel/IAdminTestimonials";

const CURRENT_TAB: AdminTestimonialsTabItem = {
  key: "testimonials",
  label: "Testimonios",
  description:
    "Gestiona los testimonios visibles en el sitio, incluyendo cliente, cargo, empresa, proyecto, foto y estado.",
  icon: Star,
};

const AdminTestimonialsPage: FC = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader
        badgeText="Administración de Testimonios"
        badgeIcon={MessageSquareQuote}
        title="Testimonios"
        description="Gestiona la información, foto, calificación, proyecto relacionado y estado de los testimonios desde una interfaz consistente con el resto del panel."
        activeSectionLabel={CURRENT_TAB.label}
        activeSectionIcon={CURRENT_TAB.icon}
        secondaryAction={{
          text: "Ver sitio",
          icon: <Eye size={16} />,
          component: "a",
          href: "/testimonios",
          variant: "secondary-outline",
        }}
      />

      <AdminTabsCard
        title="Módulo de administración"
        subtitle="Gestiona los testimonios visibles en el sitio."
        tabs={[CURRENT_TAB]}
        activeTab={CURRENT_TAB.key}
        onChangeTab={() => undefined}
      />

      <section className="space-y-4">
        <TestimonialsSection />
      </section>
    </div>
  );
};

export default AdminTestimonialsPage;