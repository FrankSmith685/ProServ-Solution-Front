
import CTASection from "@/components/home/CTASection";
import ServiciosGrid from "@/components/servicios/ServiciosGrid";
import ServiciosHero from "@/components/servicios/ServiciosHero";
import { useServiciosBootstrap } from "@/hooks/bootstrap/useServiciosBootstrap";

export default function ServiciosPage() {
  useServiciosBootstrap({
    withTestimonials: false,
    withConfigHome: false,
  });

  return (
    <>
      <ServiciosHero />
      <ServiciosGrid />
      <CTASection />
    </>
  );
}