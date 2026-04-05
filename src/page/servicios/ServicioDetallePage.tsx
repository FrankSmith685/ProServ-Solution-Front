
import CTASection from "@/components/home/CTASection";
import ServicioDetalleContent from "@/components/servicios/ServicioDetalleContent";
import ServicioDetalleHero from "@/components/servicios/ServicioDetalleHero";
import ServiciosRelacionados from "@/components/servicios/ServicioRelacionados";
import { useServiciosBootstrap } from "@/hooks/bootstrap/useServiciosBootstrap";

export default function ServicioDetallePage() {
  useServiciosBootstrap({
    withTestimonials: false,
    withConfigHome: false,
  });

  return (
    <>
      <ServicioDetalleHero />
      <ServicioDetalleContent />
      <ServiciosRelacionados />
      <CTASection />
    </>
  );
}