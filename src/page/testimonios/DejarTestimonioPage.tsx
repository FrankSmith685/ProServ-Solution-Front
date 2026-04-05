import CTASection from "@/components/home/CTASection";
import DejarTestimonioFormSection from "@/components/testimonios/DejarTestimonioFormSection";
import DejarTestimonioHero from "@/components/testimonios/DejarTestimonioHero";
import { useHomeBootstrap } from "@/hooks/bootstrap/useHomeBootstrap";

export default function DejarTestimonioPage() {
  useHomeBootstrap();

  return (
    <>
      <DejarTestimonioHero />
      <DejarTestimonioFormSection />
      <CTASection />
    </>
  );
}