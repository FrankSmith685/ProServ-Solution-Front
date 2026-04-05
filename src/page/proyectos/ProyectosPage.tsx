// src/page/proyectos/ProyectosPage.tsx
import CTASection from "@/components/home/CTASection";
import ProyectosGrid from "@/components/proyectos/ProyectosGrid";
import ProyectosHero from "@/components/proyectos/ProyectosHero";
import { useProjectsBootstrap } from "@/hooks/bootstrap/useProjectsBootstrap";

export default function ProyectosPage() {
  useProjectsBootstrap({
    withTestimonials: false,
    withConfigHome: false,
  });

  return (
    <>
      <ProyectosHero />
      <ProyectosGrid />
      <CTASection />
    </>
  );
}