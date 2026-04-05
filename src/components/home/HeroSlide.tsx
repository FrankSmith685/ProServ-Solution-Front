/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState, type FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
 ChevronRight,
  Phone,
  Sparkles,
  ShieldCheck,
  BadgeCheck,
  Wrench,
  PackageOpen,
  CircleAlert,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useHeroSlides } from "@/hooks/useHeroSlides";
import { useConfigHome } from "@/hooks/useConfigHome";
import { useSiteConfig } from "@/hooks/useConfigSite";
import { useAppState } from "@/hooks/useAppState";

import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomChip } from "@/components/ui/kit/CustomChip";
import { CustomLink } from "@/components/ui/kit/CustomLink";

import type { HeroMedia, HeroSlide } from "@/interfaces/hook/IUseHeroSlides";

type HeroSlideView = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaPath: string;
  image: string;
  badge: string;
};

const AUTOPLAY_DELAY = 6000;

const normalizePhone = (phone?: string | null): string =>
  (phone ?? "").replace(/[^\d+]/g, "");

const safeText = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
};

const isValidLink = (value?: string): boolean =>
  Boolean(value && value.trim().length > 0);

const isHeroMedia = (value: unknown): value is HeroMedia => {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Record<string, unknown>;

  return typeof candidate.id === "string" && typeof candidate.url === "string";
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

const getMediaUrl = (media: unknown): string => {
  if (typeof media === "string") return buildAbsoluteUrl(media.trim());
  if (isHeroMedia(media)) return buildAbsoluteUrl(media.url.trim());
  return "";
};

const mapHeroSlideToView = (
  slide: HeroSlide,
  heroBadgeFallback: string
): HeroSlideView | null => {
  const title = safeText(slide.titulo);
  const subtitle = safeText(slide.subtitulo);
  const cta = safeText(slide.cta_texto);
  const ctaPath = safeText(slide.cta_path);
  const image = getMediaUrl(slide.media);
  const badge = safeText(slide.badge) || heroBadgeFallback;

  if (!title || !image) return null;

  return {
    id: slide.id,
    title,
    subtitle,
    cta,
    ctaPath,
    image,
    badge,
  };
};

const HeroBackgroundDecor: FC = () => {
  return (
    <>
      <div className="absolute inset-0 bg-[#0b1220]" />
      <div className="absolute inset-0 bg-linear-to-r from-[#0b1220] via-[#111827] to-[#0f172a]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(37,99,235,0.18),transparent_24%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_22%,rgba(255,255,255,0.08),transparent_20%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_72%,rgba(37,99,235,0.10),transparent_22%)]" />
      <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/45" />
      <div className="absolute inset-0 shadow-[inset_0_0_220px_rgba(0,0,0,0.42)]" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[18%] h-28 w-28 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[12%] top-[24%] h-40 w-40 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[14%] left-[18%] h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[18%] right-[10%] h-36 w-36 rounded-full bg-white/4 blur-3xl" />
      </div>

      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-size-[42px_42px]" />
    </>
  );
};

const FeatureChip: FC<{
  icon: React.ReactNode;
  label: string;
}> = ({ icon, label }) => {
  return (
    <div className="rounded-full border border-white/10 bg-white/8 backdrop-blur-sm">
      <CustomChip
        label={label}
        clickable={false}
        icon={icon}
        variant="primary-outline"
      />
    </div>
  );
};

const HeroSlider: FC = () => {
  const [current, setCurrent] = useState<number>(0);

  const { heroSlide, configHome, siteConfig } = useAppState();
  const { loading: slidesLoading } = useHeroSlides();
  const { loading: homeLoading } = useConfigHome();
  const { loading: siteLoading } = useSiteConfig();

  const slides = useMemo<HeroSlideView[]>(() => {
    const heroBadgeFallback = safeText(configHome?.hero_cta);

    return (
      heroSlide
        ?.filter((slide) => slide.activo !== false)
        .map((slide) => mapHeroSlideToView(slide, heroBadgeFallback))
        .filter((slide): slide is HeroSlideView => slide !== null) ?? []
    );
  }, [heroSlide, configHome]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (current >= slides.length) {
      setCurrent(0);
    }
  }, [slides.length, current]);

  const isLoading = slidesLoading || homeLoading || siteLoading;
  const phoneNumber = normalizePhone(siteConfig?.contact_phone);
  const hasPhone = phoneNumber.length >= 7;

  if (isLoading && !slides.length) {
    return (
      <section
        className="
          relative overflow-hidden
          min-h-[calc(100vh-72px)]
          md:min-h-[calc(100vh-122px)]
        "
      >
        <HeroBackgroundDecor />

        <div className="relative z-10 mx-auto flex min-h-[inherit] w-full max-w-7xl items-center px-6 pt-14 pb-12 sm:px-8 md:pt-20 lg:px-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-on-dark backdrop-blur-md">
              <Sparkles size={14} className="text-primary" />
              Cargando portada
            </div>

            <div className="mt-8 space-y-4">
              <div className="h-6 w-40 animate-pulse rounded-full bg-white/10" />
              <div className="h-14 w-full max-w-2xl animate-pulse rounded-2xl bg-white/10" />
              <div className="h-14 w-[85%] animate-pulse rounded-2xl bg-white/10" />
              <div className="mt-4 h-5 w-full max-w-xl animate-pulse rounded-full bg-white/10" />
              <div className="h-5 w-[70%] animate-pulse rounded-full bg-white/10" />
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <div className="h-14 w-44 animate-pulse rounded-2xl bg-primary/40" />
              <div className="h-14 w-44 animate-pulse rounded-2xl bg-white/10" />
            </div>

            <p className="mt-8 text-sm text-on-dark-muted">
              Preparando el contenido principal del sitio...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!slides.length) {
    const companyName =
      safeText(siteConfig?.site_name) ||
      safeText(configHome?.hero_title) ||
      "Nuestra empresa";

    return (
      <section
        className="
          relative overflow-hidden bg-dark
          min-h-[calc(100vh-72px)]
          md:min-h-[calc(100vh-122px)]
        "
      >
        <HeroBackgroundDecor />

        <div className="relative z-10 mx-auto flex min-h-[inherit] w-full max-w-7xl items-center px-6 pt-14 pb-14 sm:px-8 md:pt-20 lg:px-10">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_420px]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="max-w-3xl"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-on-dark backdrop-blur-md">
                <CircleAlert size={14} className="text-primary" />
                Contenido en actualización
              </div>

              <h1 className="text-4xl leading-[0.95] font-black text-on-dark drop-shadow-[0_10px_30px_rgba(0,0,0,0.28)] sm:text-5xl lg:text-6xl xl:text-7xl">
                {companyName}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-on-dark-muted sm:text-lg sm:leading-8">
                Estamos preparando esta sección para mostrarte información
                destacada, promociones o servicios principales. Mientras tanto,
                puedes contactarnos directamente y te atenderemos lo antes
                posible.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                {hasPhone && (
                  <CustomButton
                    text="Llamar ahora"
                    href={`tel:${phoneNumber}`}
                    component="a"
                    icon={<Phone size={18} />}
                    variant="primary"
                    size="lg"
                    className="rounded-2xl! px-7! shadow-[0_16px_40px_rgba(37,99,235,0.35)]! hover:shadow-[0_18px_50px_rgba(37,99,235,0.42)]!"
                  />
                )}

                <CustomButton
                  text="Ver servicios"
                  to="/servicios"
                  component={Link}
                  icon={<ArrowRight size={18} />}
                  variant="secondary-outline"
                  size="lg"
                  className="rounded-2xl! border-white/20! bg-white/10! px-7! text-on-dark! backdrop-blur-md hover:bg-white/16!"
                />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <FeatureChip
                  icon={<ShieldCheck size={16} className="text-primary" />}
                  label="Garantía de trabajo"
                />
                <FeatureChip
                  icon={<BadgeCheck size={16} className="text-primary" />}
                  label="Atención rápida"
                />
                <FeatureChip
                  icon={<Wrench size={16} className="text-primary" />}
                  label="Personal especializado"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
              className="relative"
            >
              <div className="rounded-[28px] border border-white/10 bg-white/8 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.30)] backdrop-blur-xl">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-8">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/20">
                    <PackageOpen size={30} className="text-primary" />
                  </div>

                  <h2 className="mt-6 text-center text-2xl font-bold text-on-dark">
                    Aún no hay slides configurados
                  </h2>

                  <p className="mt-3 text-center text-sm leading-6 text-on-dark-muted">
                    Puedes mostrar este hero mientras el contenido se carga
                    desde el panel administrativo o mientras el backend aún no
                    devuelve datos.
                  </p>

                  <div className="mt-6 space-y-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-on-dark-muted">
                      • Agrega un slide activo con título e imagen.
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-on-dark-muted">
                      • Configura el CTA y la ruta para mejorar la conversión.
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-on-dark-muted">
                      • Mantén esta portada visible para no dejar un hueco vacío.
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-center">
                    <div className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1">
                      <CustomChip
                        label="Estado vacío elegante"
                        clickable={false}
                        variant="primary"
                      />
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <CustomLink
                      to="/servicios"
                      text="Ir a servicios"
                      icon={<ArrowRight size={16} />}
                      variant="primary"
                      fontFamily="var(--font-primary)"
                      className="text-on-dark! hover:text-primary!"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  const currentSlide = slides[current];

  const prev = (): void => {
    setCurrent((prevState) => (prevState - 1 + slides.length) % slides.length);
  };

  const next = (): void => {
    setCurrent((prevState) => (prevState + 1) % slides.length);
  };

  return (
    <section
      className="
        relative overflow-hidden bg-dark
        min-h-[calc(100vh-72px)]
        md:min-h-[calc(100vh-122px)]
      "
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className="h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-linear-to-r from-dark/90 via-dark/65 to-dark/35" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(37,99,235,0.18),transparent_28%)]" />
          <div className="absolute inset-0 bg-linear-to-b from-black/35 via-transparent to-black/55" />
          <div className="absolute inset-0 shadow-[inset_0_0_220px_rgba(0,0,0,0.42)]" />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 z-1 overflow-hidden">
        <div className="absolute left-[8%] top-[18%] h-28 w-28 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[12%] top-[24%] h-40 w-40 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[14%] left-[18%] h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[inherit] w-full max-w-7xl items-center px-6 pt-14 pb-16 sm:px-8 md:pt-20 lg:px-10">
        <div className="w-full">
          <div className="max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentSlide.id}`}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-2xl"
              >
                {currentSlide.badge && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="mb-6 inline-flex rounded-full border border-white/20 bg-white/8 p-1 backdrop-blur-md"
                  >
                    <CustomChip
                      label={currentSlide.badge}
                      clickable={false}
                      icon={<Sparkles size={14} className="text-primary" />}
                      variant="secondary-outline"
                      className="text-white! border-white!"
                    />
                  </motion.div>
                )}

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16, duration: 0.45 }}
                  className="max-w-[11ch] text-4xl leading-[0.95] font-black text-on-dark drop-shadow-[0_10px_30px_rgba(0,0,0,0.28)] sm:text-5xl lg:text-6xl xl:text-7xl"
                >
                  {currentSlide.title}
                </motion.h1>

                {currentSlide.subtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.24, duration: 0.45 }}
                    className="mt-6 max-w-2xl text-base leading-7 text-on-dark-muted sm:text-lg sm:leading-8"
                  >
                    {currentSlide.subtitle}
                  </motion.p>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32, duration: 0.45 }}
                  className="mt-8 flex flex-wrap gap-4"
                >
                  {isValidLink(currentSlide.cta) &&
                    isValidLink(currentSlide.ctaPath) && (
                      <CustomButton
                        text={currentSlide.cta}
                        to={currentSlide.ctaPath}
                        component={Link}
                        icon={<ArrowRight size={18} />}
                        variant="primary"
                        size="lg"
                        className="rounded-2xl! px-6! gap-2!"
                      />
                    )}

                  {hasPhone && (
                    <CustomButton
                      text="Llamar ahora"
                      href={`tel:${phoneNumber}`}
                      component="a"
                      icon={<Phone size={18} />}
                      variant="secondary-outline"
                      size="lg"
                      className="rounded-2xl! px-6! gap-2! text-white! border-white/25! bg-white/8!"
                    />
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.45 }}
                  className="mt-8 flex flex-wrap gap-3"
                >
                  <FeatureChip
                    icon={<ShieldCheck size={16} className="text-primary" />}
                    label="Garantía de trabajo"
                  />
                  <FeatureChip
                    icon={<BadgeCheck size={16} className="text-primary" />}
                    label="Atención rápida"
                  />
                  <FeatureChip
                    icon={<Wrench size={16} className="text-primary" />}
                    label="Personal especializado"
                  />
                </motion.div>

                {slides.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="mt-8 flex items-center gap-4"
                  >
                    <span className="text-xs font-medium tracking-[0.2em] text-white/48 uppercase">
                      {String(current + 1).padStart(2, "0")}
                    </span>

                    <div className="relative h-0.75 w-24 overflow-hidden rounded-full bg-white/15">
                      <motion.div
                        key={`progress-${current}`}
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{
                          duration: AUTOPLAY_DELAY / 1000,
                          ease: "linear",
                        }}
                        className="absolute left-0 top-0 h-full rounded-full bg-primary"
                      />
                    </div>

                    <span className="text-xs font-medium tracking-[0.2em] text-white/48 uppercase">
                      {String(slides.length).padStart(2, "0")}
                    </span>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.58, duration: 0.35 }}
                  className="mt-6"
                >
                  <CustomLink
                    to="/servicios"
                    text="Explorar todos los servicios"
                    icon={<ArrowRight size={16} />}
                    variant="primary"
                    fontFamily="var(--font-primary)"
                    className="text-white!"
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-md md:bottom-8">
            {slides.map((slide, index) => {
              const isActive = index === current;

              return (
                <button
                  key={slide.id}
                  onClick={() => setCurrent(index)}
                  className={`relative transition-all duration-300 ${
                    isActive
                      ? "h-3.5 w-10 rounded-full bg-primary shadow-[0_0_20px_rgba(37,99,235,0.45)]"
                      : "h-3.5 w-3.5 rounded-full bg-white/35 hover:bg-white/70"
                  }`}
                  aria-label={`Ir al slide ${index + 1}`}
                  type="button"
                />
              );
            })}
          </div>

          <button
            onClick={prev}
            className="absolute left-4 top-1/2 z-20 hidden h-13.5 w-13.5 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/20 text-on-dark backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-primary md:flex"
            aria-label="Slide anterior"
            type="button"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={next}
            className="absolute right-4 top-1/2 z-20 hidden h-13.5 w-13.5 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/20 text-on-dark backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-primary md:flex"
            aria-label="Slide siguiente"
            type="button"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}
    </section>
  );
};

export default HeroSlider;