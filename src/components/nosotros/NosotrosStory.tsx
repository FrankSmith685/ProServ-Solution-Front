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

import { useAppState } from "@/hooks/useAppState";

import type {
  ConfigNosotros,
  ConfigNosotrosMedia,
} from "@/interfaces/hook/IUseConfigNosotros";

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

const collectStoryParagraphs = (source: AboutSource): string[] => {
  return uniqueTexts(
    [
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
  const items: AboutHighlight[] = [
    {
      label: "Empresa",
      value: companyName,
    },
    {
      label: "Misión",
      value: safeText(source.mision) || "Servicio con propósito",
    },
    {
      label: "Visión",
      value: safeText(source.vision) || "Crecimiento sostenible",
    },
  ];

  return items.filter((item) => item.label && item.value);
};

const FloatingInfoCard: FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}> = ({ icon, label, value, className = "" }) => {
  return (
    <div
      className={`absolute rounded-[1.35rem] border border-white/12 bg-black/24 px-4 py-3 text-white shadow-[0_14px_40px_rgba(0,0,0,0.16)] backdrop-blur-md ${className}`}
    >
      <div className="flex items-center gap-2 text-white/72">
        {icon}
        <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>
      <p className="mt-2 text-sm font-black leading-snug">{value}</p>
    </div>
  );
};

const SectionHeader: FC<{
  subtitle: string;
  title: string;
  centered?: boolean;
}> = ({ subtitle, title, centered = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5 }}
      className={centered ? "mx-auto max-w-4xl text-center" : ""}
    >
      {subtitle ? (
        <div
          className={`inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-primary ${
            centered ? "justify-center" : ""
          }`}
        >
          <Sparkles size={14} />
          {subtitle}
        </div>
      ) : null}

      {title ? (
        <h2 className="mt-5 text-3xl font-black tracking-tight text-dark sm:text-4xl md:text-5xl xl:text-6xl">
          {title}
        </h2>
      ) : null}
    </motion.div>
  );
};

const StoryParagraphCard: FC<{
  text: string;
  index: number;
}> = ({ text, index }) => {
  const icons = [
    <CheckCircle2 key="check" size={20} />,
    <ShieldCheck key="shield" size={20} />,
    <ArrowUpRight key="arrow" size={20} />,
    <BadgeCheck key="badge" size={20} />,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="rounded-[1.7rem] border border-border bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
        {icons[index % icons.length]}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
        {text}
      </p>
    </motion.div>
  );
};

const HighlightCard: FC<AboutHighlight> = ({ label, value }) => {
  return (
    <div className="rounded-[1.7rem] border border-border bg-surface p-5 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-lg font-black tracking-tight text-dark">{value}</p>
    </div>
  );
};

const NosotrosStory: FC = () => {
  const { configNosotros, company } = useAppState();

  const about = useMemo(() => {
    if (!configNosotros || isEmptyObject(configNosotros)) return null;

    const source: AboutSource = configNosotros;
    const companyName = safeText(company?.nombre);

    const title = safeText(source.historia_titulo) || "Nuestra historia";
    const subtitle = companyName || "Sobre nosotros";

    const paragraphs = collectStoryParagraphs(source);

    const image =
      getMediaUrl(source.historia_imagen) ||
      getMediaUrl(source.historia_image) ||
      getMediaUrl(source.historia_imagen_url);

    const hasContent =
      Boolean(title) || paragraphs.length > 0 || Boolean(image);

    if (!hasContent) return null;

    return {
      title,
      subtitle,
      paragraphs,
      image,
      companyName,
    };
  }, [configNosotros, company]);

  const highlights = useMemo<AboutHighlight[]>(() => {
    if (!configNosotros || isEmptyObject(configNosotros)) return [];
    return collectHighlights(
      configNosotros as AboutSource,
      safeText(company?.nombre) || "Nuestra empresa"
    );
  }, [configNosotros, company]);

  if (!about) return null;

  const hasImage = Boolean(about.image);

  return (
    <section className="relative overflow-hidden bg-surface py-20 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_35%)]" />
      <div className="absolute left-0 top-20 h-56 w-56 rounded-full bg-primary/6 blur-3xl" />
      <div className="absolute right-0 bottom-10 h-72 w-72 rounded-full bg-primary/6 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={
            hasImage
              ? "grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(400px,540px)] lg:gap-16"
              : "mx-auto max-w-5xl"
          }
        >
          <div>
            <SectionHeader
              subtitle={about.subtitle}
              title={about.title}
              centered={!hasImage}
            />

            {about.paragraphs.length > 0 ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {about.paragraphs.map((paragraph, index) => (
                  <StoryParagraphCard
                    key={`${paragraph}-${index}`}
                    text={paragraph}
                    index={index}
                  />
                ))}
              </div>
            ) : null}

            {highlights.length > 0 ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {highlights.map((item) => (
                  <HighlightCard
                    key={`${item.label}-${item.value}`}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </div>
            ) : null}
          </div>

          {hasImage ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-dark shadow-[0_24px_80px_rgba(0,0,0,0.14)]">
                <img
                  src={about.image}
                  alt={about.title || about.companyName || "Nosotros"}
                  className="h-155 w-full object-cover"
                />

                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.52),transparent_48%)]" />

                <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                  Nuestra historia
                </div>

                {about.companyName ? (
                  <FloatingInfoCard
                    icon={<Building2 size={18} className="text-white" />}
                    label="Empresa"
                    value={about.companyName}
                    className="right-5 top-20 hidden max-w-60 lg:block"
                  />
                ) : null}
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default NosotrosStory;