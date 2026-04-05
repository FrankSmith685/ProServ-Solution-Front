import { useMemo, type FC } from "react";
import { motion } from "framer-motion";
import { Sparkles, Wrench, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { useAppState } from "@/hooks/useAppState";
import { CustomButton } from "@/components/ui/kit/CustomButton";

const safeText = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value).trim();
  return "";
};

const ServiciosHero: FC = () => {
  const { siteConfig, services } = useAppState();

  const content = useMemo(() => {
    const totalServices = Array.isArray(services)
      ? services.filter((item) => item?.activo !== false).length
      : 0;

    return {
      badge: "Nuestros servicios",
      title: "Soluciones profesionales para cada necesidad",
      description:
        safeText(siteConfig?.site_description) ||
        "Descubre nuestros servicios especializados, diseñados para brindar resultados reales, atención profesional y una experiencia de confianza.",
      totalServices,
    };
  }, [siteConfig, services]);

  return (
    <section className="relative overflow-hidden bg-dark py-20 text-white md:py-28">
      <div className="absolute inset-0 bg-[#0b1220]" />
      <div className="absolute inset-0 bg-linear-to-r from-[#0b1220] via-[#111827] to-[#0f172a]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(37,99,235,0.18),transparent_24%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_20%,rgba(255,255,255,0.08),transparent_18%)]" />
      <div className="absolute inset-0 bg-linear-to-b from-black/15 via-transparent to-black/45" />
      <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/90 backdrop-blur-md"
          >
            <Sparkles size={14} className="text-primary" />
            {content.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="mt-6 text-4xl font-black leading-[0.98] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            {content.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-white/76 md:text-base"
          >
            {content.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/88">
              <Wrench size={14} className="text-primary" />
              {content.totalServices} servicios disponibles
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <CustomButton
              text="Contáctanos"
              component={Link}
              to="/contacto"
              icon={<ArrowRight size={17} />}
              variant="primary"
              size="lg"
              className="px-4! gap-1!"
            />

            <CustomButton
              text="Ver nosotros"
              component={Link}
              to="/nosotros"
              variant="secondary"
              size="lg"
              className="px-4! gap-1!"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServiciosHero;