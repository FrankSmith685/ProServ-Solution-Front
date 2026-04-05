import AboutSection from "@/components/home/AboutSection";
import CTASection from "@/components/home/CTASection";
import HeroSlider from "@/components/home/HeroSlide";
import ProjectsSection from "@/components/home/ProjectsSection";
import ServicesSection from "@/components/home/ServicesSection";
import StatsBar from "@/components/home/StatsBar";
import TestimonialsSection from "@/components/home/TestimonialsSection";

import { useHomeBootstrap } from "@/hooks/bootstrap/useHomeBootstrap";

export default function Home() {
  useHomeBootstrap();

  return (
    <>
      <HeroSlider />
      <StatsBar />
      <ServicesSection />
      <AboutSection />
      <ProjectsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}