import { useMemo, type FC } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ArrowUpRight,
  Building2,
  BadgeCheck,
} from "lucide-react";

import { useConfigNosotros } from "@/hooks/useConfigNosotros";
import { useSiteConfig } from "@/hooks/useConfigSite";
import { useAppState } from "@/hooks/useAppState";

import type {
  ConfigNosotros,
  ConfigNosotrosMedia,
} from "@/interfaces/hook/IUseConfigNosotros";
import type { HomeAboutItem } from "@/interfaces/page/home/IHomeSections";

type AboutSource = ConfigNosotros & Record<string, unknown>;

type AboutHighlight = {
  label: string;
  value: string;
};

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

const uniqueTexts = (values: string[]): string[] => {
  const seen = new Set<string>();

  return values.filter((value) => {
    const normalized = value.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
};

const collectPoints = (source: AboutSource): string[] => {
  const candidates: unknown[] = [
    source.points,
    source.lista_puntos,
    source.items,
    source.beneficios,
    source.valores,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return uniqueTexts(
        candidate.map((item) => safeText(item)).filter(Boolean)
      );
    }
  }

  return uniqueTexts(
    [
      safeText(source.point_1),
      safeText(source.point_2),
      safeText(source.point_3),
      safeText(source.point_4),
      safeText(source.punto_1),
      safeText(source.punto_2),
      safeText(source.punto_3),
      safeText(source.punto_4),
      safeText(source.item_1),
      safeText(source.item_2),
      safeText(source.item_3),
      safeText(source.item_4),
      safeText(source.historia_p1),
      safeText(source.historia_p2),
      safeText(source.historia_p3),
    ].filter(Boolean)
  );
};

const collectHighlights = (
  source: AboutSource,
  companyName: string
): AboutHighlight[] => {
  const highlightAValue =
    safeText(source.badgeValue) ||
    safeText(source.badge_value) ||
    safeText(source.etiqueta_valor) ||
    safeText(source.experiencia_valor) ||
    safeText(source.anos_experiencia);

  const highlightALabel =
    safeText(source.badgeText) ||
    safeText(source.badge_text) ||
    safeText(source.etiqueta_texto) ||
    "Experiencia";

  const highlightBValue =
    safeText(source.highlight_value_1) ||
    safeText(source.valor_destacado_1) ||
    safeText(source.years_label) ||
    companyName;

  const highlightBLabel =
    safeText(source.highlight_label_1) ||
    safeText(source.etiqueta_destacada_1) ||
    "Compromiso";

  const highlightCValue =
    safeText(source.highlight_value_2) ||
    safeText(source.valor_destacado_2) ||
    "Calidad";

  const highlightCLabel =
    safeText(source.highlight_label_2) ||
    safeText(source.etiqueta_destacada_2) ||
    "Enfoque";

  const items: AboutHighlight[] = [
    {
      label: highlightALabel,
      value: highlightAValue,
    },
    {
      label: highlightBLabel,
      value: highlightBValue,
    },
    {
      label: highlightCLabel,
      value: highlightCValue,
    },
  ];

  return items.filter(
    (item) => safeText(item.label).length > 0 && safeText(item.value).length > 0
  );
};

const AboutSectionSkeleton: FC = () => {
  return (
    <section className="relative overflow-hidden bg-surface py-16 sm:py-20 xl:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_38%)]" />
      <div className="absolute -left-20 top-10 h-48 w-48 rounded-full bg-primary/8 blur-3xl sm:h-64 sm:w-64" />
      <div className="absolute -right-20 bottom-10 h-56 w-56 rounded-full bg-primary/8 blur-3xl sm:h-72 sm:w-72" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 xl:px-8">
        <div className="grid items-center gap-10 xl:grid-cols-[minmax(0,1.02fr)_minmax(420px,540px)] xl:gap-16 2xl:gap-20">
          <div className="max-w-3xl">
            <div className="h-8 w-36 animate-pulse rounded-full bg-primary/10 sm:w-40" />
            <div className="mt-5 h-10 w-11/12 animate-pulse rounded-2xl bg-primary/10 sm:h-12" />
            <div className="mt-3 h-10 w-8/12 animate-pulse rounded-2xl bg-primary/10 sm:h-12" />

            <div className="mt-6 space-y-3">
              <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-11/12 animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-10/12 animate-pulse rounded-full bg-muted" />
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`about-point-skeleton-${index}`}
                  className="rounded-3xl border border-border bg-surface p-5 shadow-sm"
                >
                  <div className="h-10 w-10 animate-pulse rounded-2xl bg-primary/10" />
                  <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-muted" />
                  <div className="mt-2 h-4 w-4/5 animate-pulse rounded-full bg-muted" />
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`about-highlight-skeleton-${index}`}
                  className="rounded-3xl border border-border bg-surface p-5 shadow-sm"
                >
                  <div className="h-4 w-20 animate-pulse rounded-full bg-muted" />
                  <div className="mt-3 h-8 w-24 animate-pulse rounded-2xl bg-primary/10" />
                </div>
              ))}
            </div>
          </div>

          <div className="hidden xl:block">
            <div className="h-155 w-full animate-pulse rounded-[2.25rem] bg-muted shadow-xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

const SectionHeader: FC<{
  subtitle: string;
  title: string;
  description: string;
  secondaryDescription: string;
  centered?: boolean;
}> = ({
  subtitle,
  title,
  description,
  secondaryDescription,
  centered = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5 }}
      className={centered ? "mx-auto max-w-4xl text-center" : "max-w-3xl"}
    >
      {subtitle ? (
        <div
          className={`inline-flex max-w-full items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary sm:text-xs sm:tracking-[0.22em] ${
            centered ? "justify-center" : ""
          }`}
        >
          <Sparkles size={14} className="shrink-0" />
          <span className="truncate">{subtitle}</span>
        </div>
      ) : null}

      {title ? (
        <h2 className="mt-5 text-3xl leading-tight font-black tracking-tight text-dark sm:text-4xl md:text-5xl xl:text-[3.35rem] xl:leading-[1.02]">
          {title}
        </h2>
      ) : null}

      {description ? (
        <p
          className={`mt-6 text-sm leading-relaxed text-muted-foreground md:text-base xl:text-[1.02rem] xl:leading-8 ${
            centered ? "mx-auto max-w-3xl" : "max-w-2xl xl:max-w-3xl"
          }`}
        >
          {description}
        </p>
      ) : null}

      {secondaryDescription ? (
        <p
          className={`mt-4 text-sm leading-relaxed text-muted-foreground md:text-base xl:text-[1.02rem] xl:leading-8 ${
            centered ? "mx-auto max-w-3xl" : "max-w-2xl xl:max-w-3xl"
          }`}
        >
          {secondaryDescription}
        </p>
      ) : null}
    </motion.div>
  );
};

const PointCard: FC<{
  point: string;
  index: number;
}> = ({ point, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl sm:rounded-[1.7rem] sm:p-5"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_52%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start gap-3 sm:gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary shadow-md shadow-primary/20 ring-1 ring-primary/10 sm:h-11 sm:w-11">
          <CheckCircle2 size={18} className="text-white sm:size-5" />
        </div>

        <div className="min-w-0 pt-0.5">
          <p className="text-sm font-semibold leading-6 text-dark md:text-[15px] xl:text-[15.5px]">
            {point}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const HighlightCard: FC<{
  item: AboutHighlight;
  index: number;
}> = ({ item, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.4, delay: 0.14 + index * 0.06 }}
      className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg sm:rounded-[1.7rem] sm:p-5"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.08),transparent_48%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck size={18} />
        </div>

        <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">
          {item.label}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <p className="wrap-break-word text-lg font-black tracking-tight text-dark sm:text-2xl">
            {item.value}
          </p>
          <ArrowUpRight size={16} className="shrink-0 text-primary" />
        </div>
      </div>
    </motion.div>
  );
};

const FloatingInfoCard: FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  className: string;
}> = ({ icon, label, value, className }) => {
  return (
    <div
      className={`absolute z-20 rounded-[1.4rem] border border-white/15 bg-white/10 p-4 text-white shadow-[0_16px_40px_rgba(0,0,0,0.18)] backdrop-blur-md ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/65">
            {label}
          </p>
          <p className="mt-1 line-clamp-2 text-sm font-semibold text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

const AboutImageCard: FC<{
  image: string;
  title: string;
  badgeText: string;
  badgeValue: string;
  companyName: string;
}> = ({ image, title, badgeText, badgeValue, companyName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative order-1 xl:order-2"
    >
      <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
      <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-4xl border border-border bg-surface shadow-[0_24px_80px_rgba(0,0,0,0.10)] xl:rounded-[2.5rem]">
        <div className="relative h-90 overflow-hidden sm:h-110 md:h-130 xl:h-155">
          <img
            src={image}
            alt={title || "Nosotros"}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-linear-to-t from-secondary/92 via-secondary/28 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-black/18 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.10),transparent_24%)]" />

          <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
            Presentación institucional
          </div>

          {badgeValue ? (
            <FloatingInfoCard
              icon={<Sparkles size={18} className="text-white" />}
              label={badgeText || "Experiencia"}
              value={badgeValue}
              className="left-5 top-20 hidden max-w-56 xl:block"
            />
          ) : null}

          {companyName ? (
            <FloatingInfoCard
              icon={<Building2 size={18} className="text-white" />}
              label="Empresa"
              value={companyName}
              className="right-5 top-20 hidden max-w-60 xl:block"
            />
          ) : null}

          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6">
            <div className="rounded-3xl border border-white/12 bg-black/24 p-4 text-white shadow-[0_14px_50px_rgba(0,0,0,0.18)] backdrop-blur-md sm:rounded-[1.7rem] sm:p-5 md:p-6">
              <div className="flex items-center gap-2 text-white/70">
                <BadgeCheck size={16} className="shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] sm:text-[11px]">
                  Perfil institucional
                </span>
              </div>

              <h3 className="mt-4 text-xl leading-tight font-black tracking-tight text-white sm:text-2xl xl:text-3xl">
                {title || companyName || "Nuestra historia"}
              </h3>

              {companyName ? (
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/78">
                  Una presentación orientada a comunicar confianza, experiencia y
                  una propuesta de valor más sólida.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AboutSection: FC = () => {
  const { configNosotros, company, siteConfig } = useAppState();
  const { loading: aboutLoading } = useConfigNosotros();
  const { loading: siteLoading } = useSiteConfig();

  const shouldFetchAbout = useMemo<boolean>(() => {
    return !configNosotros || isEmptyObject(configNosotros);
  }, [configNosotros]);

  const shouldFetchSite = useMemo<boolean>(() => {
    return !company || !siteConfig || isEmptyObject(siteConfig);
  }, [company, siteConfig]);

  const about = useMemo<HomeAboutItem | null>(() => {
    if (!configNosotros || isEmptyObject(configNosotros)) return null;

    const source: AboutSource = configNosotros;
    const companyName = safeText(company?.nombre);

    const title =
      safeText(source.title) ||
      safeText(source.titulo) ||
      safeText(source.about_title) ||
      safeText(source.nosotros_titulo) ||
      safeText(source.historia_titulo);

    const subtitle =
      safeText(source.subtitle) ||
      safeText(source.subtitulo) ||
      safeText(source.about_subtitle) ||
      companyName ||
      "Sobre nosotros";

    const description =
      safeText(source.description) ||
      safeText(source.descripcion) ||
      safeText(source.about_description) ||
      safeText(source.historia_p1);

    const secondaryDescription =
      safeText(source.secondaryDescription) ||
      safeText(source.descripcion_secundaria) ||
      safeText(source.about_secondary_description) ||
      safeText(source.historia_p2) ||
      safeText(source.historia_p3);

    const image =
      getMediaUrl(source.image) ||
      getMediaUrl(source.imagen) ||
      getMediaUrl(source.image_url) ||
      getMediaUrl(source.imagen_url) ||
      getMediaUrl(source.media) ||
      getMediaUrl(source.historia_imagen);

    const badgeText =
      safeText(source.badgeText) ||
      safeText(source.badge_text) ||
      safeText(source.etiqueta_texto) ||
      "Experiencia";

    const badgeValue =
      safeText(source.badgeValue) ||
      safeText(source.badge_value) ||
      safeText(source.etiqueta_valor);

    const points = collectPoints(source);

    if (
      !title &&
      !subtitle &&
      !description &&
      !secondaryDescription &&
      !image &&
      points.length === 0
    ) {
      return null;
    }

    return {
      title,
      subtitle,
      description,
      secondaryDescription,
      image,
      badgeText,
      badgeValue,
      points,
    };
  }, [configNosotros, company]);

  const highlights = useMemo<AboutHighlight[]>(() => {
    if (!configNosotros || isEmptyObject(configNosotros)) return [];

    const source: AboutSource = configNosotros;
    const companyName = safeText(company?.nombre);

    return collectHighlights(source, companyName);
  }, [configNosotros, company]);

  const isLoading =
    (aboutLoading && shouldFetchAbout) || (siteLoading && shouldFetchSite);

  const hasImage = Boolean(about?.image);

  if (isLoading && !about) {
    return <AboutSectionSkeleton />;
  }

  if (!about) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-surface py-16 sm:py-20 xl:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_35%)]" />
      <div className="absolute left-0 top-20 h-44 w-44 rounded-full bg-primary/6 blur-3xl sm:h-56 sm:w-56" />
      <div className="absolute right-0 bottom-10 h-56 w-56 rounded-full bg-primary/6 blur-3xl sm:h-72 sm:w-72" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 xl:px-8">
        <div
          className={
            hasImage
              ? "grid items-center gap-10 xl:grid-cols-[minmax(0,1.02fr)_minmax(420px,540px)] xl:gap-16 2xl:gap-20"
              : "mx-auto max-w-5xl"
          }
        >
          <div className={hasImage ? "order-2 xl:order-1 max-w-3xl" : ""}>
            <SectionHeader
              subtitle={about.subtitle}
              title={about.title}
              description={about.description}
              secondaryDescription={about.secondaryDescription}
              centered={!hasImage}
            />

            {about.points.length > 0 ? (
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {about.points.map((point, index) => (
                  <PointCard
                    key={`${point}-${index}`}
                    point={point}
                    index={index}
                  />
                ))}
              </div>
            ) : null}

            {highlights.length > 0 ? (
              <div
                className={`mt-8 grid grid-cols-1 gap-4 ${
                  hasImage ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {highlights.map((item, index) => (
                  <HighlightCard
                    key={`${item.label}-${item.value}-${index}`}
                    item={item}
                    index={index}
                  />
                ))}
              </div>
            ) : null}
          </div>

          {hasImage ? (
            <AboutImageCard
              image={about.image}
              title={about.title}
              badgeText={about.badgeText}
              badgeValue={about.badgeValue}
              companyName={safeText(company?.nombre)}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;