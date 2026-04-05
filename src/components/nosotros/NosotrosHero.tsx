import { useMemo, type FC } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Building2,
  ShieldCheck,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useAppState } from "@/hooks/useAppState";
import { CustomButton } from "@/components/ui/kit/CustomButton";

import type {
  ConfigNosotros,
  ConfigNosotrosMedia,
} from "@/interfaces/hook/IUseConfigNosotros";

type AboutSource = ConfigNosotros & Record<string, unknown>;

const safeText = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value).trim();
  return "";
};

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isEmptyObject = (value: unknown): boolean => {
  return isPlainObject(value) && Object.keys(value).length === 0;
};

const isConfigNosotrosMedia = (value: unknown): value is ConfigNosotrosMedia => {
  if (!isPlainObject(value)) return false;
  return typeof value.id === "string" && typeof value.url === "string";
};

const buildAbsoluteUrl = (url: string): string => {
  const cleanUrl = safeText(url);
  if (!cleanUrl) return "";

  if (
    cleanUrl.startsWith("http://") ||
    cleanUrl.startsWith("https://") ||
    cleanUrl.startsWith("data:") ||
    cleanUrl.startsWith("blob:")
  ) {
    return cleanUrl;
  }

  const baseUrl =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:3001";

  return `${baseUrl.replace(/\/$/, "")}/${cleanUrl.replace(/^\//, "")}`;
};

const getMediaUrl = (value: unknown): string => {
  if (typeof value === "string") return buildAbsoluteUrl(value.trim());
  if (isConfigNosotrosMedia(value)) return buildAbsoluteUrl(value.url.trim());
  return "";
};

const NosotrosHeroSkeleton: FC = () => {
  return (
    <section className="relative overflow-hidden bg-dark py-20 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.20),transparent_36%)]" />
      <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)] lg:gap-16">
          <div>
            <div className="h-8 w-40 animate-pulse rounded-full bg-white/10" />
            <div className="mt-6 h-14 w-11/12 animate-pulse rounded-3xl bg-white/10" />
            <div className="mt-4 h-14 w-8/12 animate-pulse rounded-3xl bg-white/10" />
            <div className="mt-6 h-5 w-full max-w-2xl animate-pulse rounded-full bg-white/10" />
            <div className="mt-3 h-5 w-10/12 animate-pulse rounded-full bg-white/10" />

            <div className="mt-10 flex flex-wrap gap-4">
              <div className="h-14 w-44 animate-pulse rounded-2xl bg-primary/40" />
              <div className="h-14 w-44 animate-pulse rounded-2xl bg-white/10" />
            </div>
          </div>

          <div className="h-130 animate-pulse rounded-4xl bg-white/8" />
        </div>
      </div>
    </section>
  );
};

const NosotrosHero: FC = () => {
  const { configNosotros, company, siteConfig } = useAppState();

  const heroData = useMemo(() => {
    if (!configNosotros || isEmptyObject(configNosotros)) return null;

    const source: AboutSource = configNosotros;

    const companyName =
      safeText(company?.nombre) ||
      safeText(siteConfig?.site_name) ||
      "Nuestra empresa";

    const title =
      safeText(source.titulo) ||
      safeText(source.nosotros_titulo) ||
      "Conoce más sobre nosotros";

    const description =
      safeText(source.descripcion) ||
      "Construimos relaciones duraderas con una atención profesional, cercana y enfocada en resultados.";

    const secondaryDescription =
      safeText(source.descripcion_secundaria) ||
      safeText(source.subdescripcion);

    const image =
      getMediaUrl(source.imagen) ||
      getMediaUrl(source.image) ||
      getMediaUrl(source.image_url) ||
      getMediaUrl(source.imagen_url);

    const mission = safeText(source.mision);
    const vision = safeText(source.vision);

    const hasContent =
      Boolean(title) ||
      Boolean(description) ||
      Boolean(secondaryDescription) ||
      Boolean(image) ||
      Boolean(mission) ||
      Boolean(vision);

    if (!hasContent) return null;

    return {
      companyName,
      title,
      description,
      secondaryDescription,
      image,
      mission,
      vision,
    };
  }, [configNosotros, company, siteConfig]);

  if (!heroData) {
    return <NosotrosHeroSkeleton />;
  }

  const hasImage = Boolean(heroData.image);

  return (
    <section className="relative overflow-hidden bg-dark py-20 text-white md:py-28">
      <div className="absolute inset-0 bg-[#0b1220]" />
      <div className="absolute inset-0 bg-linear-to-r from-[#0b1220] via-[#111827] to-[#0f172a]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.18),transparent_24%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.08),transparent_18%)]" />
      <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/40" />
      <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={
            hasImage
              ? "grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(380px,540px)] lg:gap-16"
              : "mx-auto max-w-4xl text-center"
          }
        >
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className={`inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/90 backdrop-blur-md ${
                hasImage ? "" : "justify-center"
              }`}
            >
              <Sparkles size={14} className="text-primary" />
              Presentación institucional
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              {heroData.title}
            </h1>

            {heroData.description ? (
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/76 md:text-base">
                {heroData.description}
              </p>
            ) : null}

            {heroData.secondaryDescription ? (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/66 md:text-base">
                {heroData.secondaryDescription}
              </p>
            ) : null}

            <div
              className={`mt-8 flex flex-wrap gap-3 ${
                hasImage ? "" : "justify-center"
              }`}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/88">
                <Building2 size={14} className="text-primary" />
                {heroData.companyName}
              </div>

              {heroData.mission ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/88">
                  <ShieldCheck size={14} className="text-primary" />
                  Misión clara
                </div>
              ) : null}

              {heroData.vision ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/88">
                  <BadgeCheck size={14} className="text-primary" />
                  Visión definida
                </div>
              ) : null}
            </div>

            <div
              className={`mt-10 flex flex-wrap gap-4 ${
                hasImage ? "" : "justify-center"
              }`}
            >
              <CustomButton
                text="Ver servicios"
                component={Link}
                to="/servicios"
                icon={<ArrowRight size={17} />}
                variant="primary"
                size="lg"
                className="px-4! gap-1!"
              />

              <CustomButton
                text="Contáctanos"
                component={Link}
                to="/contacto"
                variant="secondary"
                size="lg"
                className="px-4! gap-1!"
              />
            </div>
          </motion.div>

          {hasImage ? (
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-4xl border border-white/12 bg-white/6 shadow-[0_30px_90px_rgba(0,0,0,0.24)]">
                <img
                  src={heroData.image}
                  alt={heroData.companyName}
                  className="h-130 w-full object-cover"
                />

                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55),transparent_42%)]" />

                <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                  Nosotros
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <div className="rounded-[1.7rem] border border-white/12 bg-black/24 p-5 text-white shadow-[0_14px_50px_rgba(0,0,0,0.18)] backdrop-blur-md sm:p-6">
                    <div className="flex items-center gap-2 text-white/70">
                      <BadgeCheck size={16} />
                      <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
                        Perfil institucional
                      </span>
                    </div>

                    <h2 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">
                      {heroData.companyName}
                    </h2>

                    <p className="mt-3 text-sm leading-relaxed text-white/78">
                      Una presentación orientada a comunicar confianza,
                      experiencia y una propuesta de valor más sólida.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default NosotrosHero;