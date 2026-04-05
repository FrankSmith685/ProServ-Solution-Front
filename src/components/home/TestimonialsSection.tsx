/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState, type FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
  Sparkles,
  MessageSquareQuote,
} from "lucide-react";

import { useTestimonials } from "@/hooks/useTestimonials";
import { useAppState } from "@/hooks/useAppState";

import type { HomeTestimonialItem } from "@/interfaces/page/home/IHomeSections";

type TestimonialMediaRef = {
  url?: string | null;
};

type TestimonialViewSource = Record<string, unknown> & {
  id?: string;
  nombre?: string;
  cargo?: string;
  empresa?: string;
  testimonio?: string;
  calificacion?: number | string | null;
  activo?: boolean;
  foto?: string | TestimonialMediaRef | null;
  imagen?: string | TestimonialMediaRef | null;
  image?: string | TestimonialMediaRef | null;
  photo?: string | TestimonialMediaRef | null;
  media?: string | TestimonialMediaRef | null;
};

type TestimonialCardItem = HomeTestimonialItem & {
  foto: string;
};

const AUTOPLAY_DELAY = 6000;

const safeText = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value).trim();
  return "";
};

const safeRating = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.min(5, Math.max(0, Math.round(value)));
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return Math.min(5, Math.max(0, Math.round(parsed)));
    }
  }

  return 0;
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
  if (typeof value === "string") return buildAbsoluteUrl(value);

  if (typeof value === "object" && value !== null) {
    const candidate = value as TestimonialMediaRef;
    return buildAbsoluteUrl(safeText(candidate.url));
  }

  return "";
};

const getTestimonialPhoto = (testimonial: TestimonialViewSource): string => {
  return (
    getMediaUrl(testimonial.photo) ||
    getMediaUrl(testimonial.foto) ||
    getMediaUrl(testimonial.image) ||
    getMediaUrl(testimonial.imagen) ||
    getMediaUrl(testimonial.media)
  );
};

const getInitials = (name: string): string => {
  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (!parts.length) return "CL";

  return parts.map((part) => part.charAt(0).toUpperCase()).join("");
};

const TestimonialsSectionSkeleton: FC = () => {
  return (
    <section className="relative overflow-hidden bg-surface py-20 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_38%)]" />
      <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-primary/8 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mx-auto h-8 w-40 animate-pulse rounded-full bg-primary/10" />
          <div className="mx-auto mt-5 h-12 w-10/12 animate-pulse rounded-2xl bg-primary/10 sm:w-8/12" />
          <div className="mx-auto mt-4 h-4 w-full max-w-2xl animate-pulse rounded-full bg-muted" />
          <div className="mx-auto mt-3 h-4 w-9/12 animate-pulse rounded-full bg-muted" />
        </div>

        <div className="rounded-4xl border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="h-24 w-24 animate-pulse rounded-[1.75rem] bg-primary/10" />
              <div className="mt-5 h-4 w-28 animate-pulse rounded-full bg-muted" />
              <div className="mt-3 h-8 w-36 animate-pulse rounded-2xl bg-primary/10" />
              <div className="mt-3 h-4 w-24 animate-pulse rounded-full bg-muted" />
            </div>

            <div>
              <div className="h-10 w-10 animate-pulse rounded-2xl bg-primary/10" />
              <div className="mt-6 space-y-3">
                <div className="h-5 w-full animate-pulse rounded-full bg-muted" />
                <div className="h-5 w-11/12 animate-pulse rounded-full bg-muted" />
                <div className="h-5 w-10/12 animate-pulse rounded-full bg-muted" />
                <div className="h-5 w-9/12 animate-pulse rounded-full bg-muted" />
              </div>

              <div className="mt-8 flex gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={`testimonial-star-skeleton-${index}`}
                    className="h-5 w-5 animate-pulse rounded-full bg-primary/10"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TestimonialsEmptyState: FC = () => {
  return (
    <div className="relative overflow-hidden rounded-4xl border border-border bg-surface px-6 py-14 text-center shadow-sm md:px-10 md:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.10),transparent_42%)]" />
      <div className="absolute -left-16 top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-16 bottom-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative">
        <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-[1.4rem] bg-primary shadow-lg shadow-primary/25 ring-8 ring-primary/10">
          <MessageSquareQuote size={30} className="text-white" />
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          <Sparkles size={14} />
          Opiniones en preparación
        </div>

        <h3 className="mt-5 text-2xl font-black tracking-tight text-dark md:text-3xl">
          Aún no hay testimonios publicados
        </h3>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Esta sección se mostrará automáticamente cuando existan testimonios
          activos y válidos en el sistema.
        </p>
      </div>
    </div>
  );
};

const TestimonialsSectionHeader: FC<{ total: number }> = ({ total }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="mx-auto mb-12 max-w-3xl text-center"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
        <Sparkles size={14} />
        Testimonios
      </div>

      <h2 className="mt-5 text-3xl font-black tracking-tight text-dark sm:text-4xl md:text-5xl">
        Lo que dicen nuestros clientes
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
        Opiniones reales con una presentación más elegante, equilibrada y
        profesional para reforzar confianza y credibilidad.
      </p>

      {total > 0 ? (
        <div className="mt-6 inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-bold text-primary">
          {total} testimonio{total === 1 ? "" : "s"} disponible
          {total === 1 ? "" : "s"}
        </div>
      ) : null}
    </motion.div>
  );
};

const RatingStars: FC<{ rating: number }> = ({ rating }) => {
  if (rating <= 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {Array.from({ length: 5 }).map((_, index) => {
        const active = index < rating;

        return (
          <div
            key={`rating-star-${index}`}
            className={`flex h-8 w-8 items-center justify-center rounded-full border ${
              active
                ? "border-primary/20 bg-primary/10 text-primary"
                : "border-border bg-surface text-muted-foreground/40"
            }`}
          >
            <Star
              size={15}
              className={active ? "fill-primary text-primary" : "text-inherit"}
            />
          </div>
        );
      })}
    </div>
  );
};

const TestimonialAvatar: FC<{
  name: string;
  photo: string;
}> = ({ name, photo }) => {
  if (photo) {
    return (
      <div className="relative h-24 w-24 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.16)] ring-4 ring-primary/10">
        <img
          src={photo}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-primary text-2xl font-black text-white shadow-[0_16px_40px_rgba(37,99,235,0.28)] ring-4 ring-primary/10">
      {getInitials(name)}
    </div>
  );
};

const TestimonialCard: FC<{
  item: TestimonialCardItem;
}> = ({ item }) => {
  const roleLine = [item.cargo, item.empresa].filter(Boolean).join(" · ");

  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={item.id}
        initial={{ opacity: 0, y: 24, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -18, scale: 0.99 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-4xl border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-8 lg:p-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.08),transparent_36%)]" />
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-primary/8 blur-3xl" />

        <div className="relative grid items-center gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <TestimonialAvatar name={item.nombre} photo={item.foto} />

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
              <Sparkles size={13} />
              Cliente verificado
            </div>

            <h3 className="mt-5 text-xl font-black tracking-tight text-dark">
              {item.nombre}
            </h3>

            {roleLine ? (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {roleLine}
              </p>
            ) : null}

            {item.calificacion > 0 ? (
              <div className="mt-5">
                <RatingStars rating={item.calificacion} />
              </div>
            ) : null}
          </div>

          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-primary shadow-lg shadow-primary/20 ring-1 ring-primary/10">
              <Quote size={26} className="text-white" />
            </div>

            <blockquote className="mt-6 text-lg leading-8 text-dark/90 md:text-[1.35rem] md:leading-9">
              “{item.testimonio}”
            </blockquote>

            <div className="mt-8 flex items-center gap-3">
              <div className="h-px w-14 bg-primary/25" />
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                Experiencia real
              </span>
            </div>
          </div>
        </div>
      </motion.article>
    </AnimatePresence>
  );
};

const TestimonialsNavigation: FC<{
  list: TestimonialCardItem[];
  current: number;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
}> = ({ list, current, onPrev, onNext, onGoTo }) => {
  if (list.length <= 1) return null;

  return (
    <div className="mt-8 flex flex-col items-center gap-5">
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-dark shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary hover:text-white"
          aria-label="Testimonio anterior"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-3 shadow-sm">
          {list.map((item, index) => {
            const isActive = index === current;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onGoTo(index)}
                className={`relative transition-all duration-300 ${
                  isActive
                    ? "h-3.5 w-10 rounded-full bg-primary shadow-[0_0_20px_rgba(37,99,235,0.35)]"
                    : "h-3.5 w-3.5 rounded-full bg-primary/20 hover:bg-primary/45"
                }`}
                aria-label={`Ir al testimonio ${index + 1}`}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={onNext}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-dark shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary hover:text-white"
          aria-label="Siguiente testimonio"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
        {String(current + 1).padStart(2, "0")} /{" "}
        {String(list.length).padStart(2, "0")}
      </div>
    </div>
  );
};

const TestimonialsSection: FC = () => {
  const [current, setCurrent] = useState<number>(0);

  const { testimonials } = useAppState();
  const { loading } = useTestimonials();

  const list = useMemo<TestimonialCardItem[]>(() => {
    return (
      testimonials
        ?.filter((testimonial) => testimonial.activo !== false)
        .map((testimonial) => {
          const source = testimonial as unknown as TestimonialViewSource;

          return {
            id: safeText(source.id),
            nombre: safeText(source.nombre),
            cargo: safeText(source.cargo),
            empresa: safeText(source.empresa),
            testimonio: safeText(source.testimonio),
            calificacion: safeRating(source.calificacion),
            foto: getTestimonialPhoto(source),
            activo: source.activo ?? true,
          };
        })
        .filter(
          (testimonial) =>
            testimonial.id.length > 0 &&
            testimonial.nombre.length > 0 &&
            testimonial.testimonio.length > 0
        ) ?? []
    );
  }, [testimonials]);

  useEffect(() => {
    if (list.length <= 1) return;

    const timer = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % list.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(timer);
  }, [list.length]);

  useEffect(() => {
    if (current >= list.length) {
      setCurrent(0);
    }
  }, [current, list.length]);

  const currentItem = useMemo<TestimonialCardItem | null>(() => {
    return list[current] ?? null;
  }, [current, list]);

  const prev = (): void => {
    setCurrent((prevIndex) => (prevIndex - 1 + list.length) % list.length);
  };

  const next = (): void => {
    setCurrent((prevIndex) => (prevIndex + 1) % list.length);
  };

  if (loading && !list.length) {
    return <TestimonialsSectionSkeleton />;
  }

  return (
    <section className="relative overflow-hidden bg-surface py-20 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_35%)]" />
      <div className="absolute left-0 top-20 h-52 w-52 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute right-0 top-1/3 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <TestimonialsSectionHeader total={list.length} />

        {!list.length ? (
          <TestimonialsEmptyState />
        ) : currentItem ? (
          <>
            <TestimonialCard item={currentItem} />

            <TestimonialsNavigation
              list={list}
              current={current}
              onPrev={prev}
              onNext={next}
              onGoTo={setCurrent}
            />
          </>
        ) : null}
      </div>
    </section>
  );
};

export default TestimonialsSection;