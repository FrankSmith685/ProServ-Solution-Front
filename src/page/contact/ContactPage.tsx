
import ContactoFormSection from "@/components/contacto/ContactoFormSection";
import ContactoHero from "@/components/contacto/ContactoHero";
import CTASection from "@/components/home/CTASection";
import { useContactoBootstrap } from "@/hooks/bootstrap/useContactoBootstrap";

export default function ContactoPage() {
  useContactoBootstrap({
    withServices: true,
    withSiteConfig: true,
  });

  return (
    <>
      <ContactoHero />
      <ContactoFormSection />
      <CTASection />
    </>
  );
}