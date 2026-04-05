import CTASection from "@/components/home/CTASection";
import ProyectoDetalleContent from "@/components/proyectos/ProyectoDetalleContent";
import ProyectoDetalleHero from "@/components/proyectos/ProyectoDetalleHero";
import ProyectosRelacionados from "@/components/proyectos/ProyectosRelacionados";
import { useProjectsBootstrap } from "@/hooks/bootstrap/useProjectsBootstrap";

export default function ProyectoDetallePage() {
  useProjectsBootstrap({
    withTestimonials: false,
    withConfigHome: false,
  });

  return (
    <>
      <ProyectoDetalleHero />
      <ProyectoDetalleContent />
      <ProyectosRelacionados />
      <CTASection />
    </>
  );
}