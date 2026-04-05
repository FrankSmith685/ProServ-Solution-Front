
import CTASection from "@/components/home/CTASection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NosotrosHero from "@/components/nosotros/NosotrosHero";
import NosotrosStory from "@/components/nosotros/NosotrosStory";
import NosotrosValues from "@/components/nosotros/NosotrosValue";

import { useNosotrosBootstrap } from "@/hooks/bootstrap/useNosotrosBootstrap";

export default function NosotrosPage() {
  useNosotrosBootstrap({
    withTestimonials: true,
    withServices: false,
  });

  return (
    <>
      <NosotrosHero />
      <NosotrosStory />
      <NosotrosValues />
      <TestimonialsSection/>
      <CTASection />
    </>
  );
}