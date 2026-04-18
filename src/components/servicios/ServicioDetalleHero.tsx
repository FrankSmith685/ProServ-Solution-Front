import {
  useMemo,
  type FC,
  cloneElement,
  isValidElement,
} from "react";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { useAppState } from "@/hooks/useAppState";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { getServiceIconMeta } from "@/shared/design/serviceIcons";

import type { Service } from "@/interfaces/hook/IUseServices";

const safeText = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value).trim();
  return "";
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

const getServiceImage = (service: Service): string => {
  const directImageUrl = buildAbsoluteUrl(
    safeText((service as Service & { image_url?: string }).image_url)
  );
  if (directImageUrl) return directImageUrl;

  const mediaUrl = buildAbsoluteUrl(
    safeText(
      (
        service as Service & {
          media?: { url?: string | null } | null;
        }
      ).media?.url
    )
  );
  if (mediaUrl) return mediaUrl;

  return "";
};

const makeSlug = (value: string): string => {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const matchesService = (service: Service, slug: string): boolean => {
  const currentSlug = safeText(slug);
  const serviceId = safeText(service.id);
  const explicitSlug = safeText((service as Service & { slug?: string }).slug);
  const generatedSlug = makeSlug(safeText(service.titulo));

  return (
    serviceId === currentSlug ||
    explicitSlug === currentSlug ||
    generatedSlug === currentSlug
  );
};

const renderIcon = (
  icon: unknown,
  className = "text-white",
  size = 20
) => {
  if (isValidElement<{ className?: string; size?: number }>(icon)) {
    return cloneElement(icon, {
      size,
      className,
    });
  }

  return <Wrench size={size} className={className} />;
};

const ServicioDetalleHero: FC = () => {
  const { slug = "" } = useParams();
  const { services } = useAppState();

  const service = useMemo(() => {
    if (!Array.isArray(services)) return null;

    return (
      services.find(
        (item) => item?.activo !== false && matchesService(item, slug)
      ) ?? null
    );
  }, [services, slug]);

  if (!service) {
    return (
      <section className="relative overflow-hidden bg-dark py-20 text-white md:py-28">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-black sm:text-5xl">
            Servicio no encontrado
          </h1>

          <p className="mt-4 text-white/70">
            El servicio solicitado no está disponible o ya no existe.
          </p>

          <div className="mt-8">
            <CustomButton
              text="Volver a servicios"
              component={Link}
              to="/servicios"
              icon={<ArrowRight size={17} />}
              variant="primary"
              size="lg"
            />
          </div>
        </div>
      </section>
    );
  }

  const image = getServiceImage(service);
  const iconMeta = getServiceIconMeta(safeText(service.icono));
  const serviceIcon = renderIcon(iconMeta?.icon, "text-white", 20);

  return (
    <section className="relative overflow-hidden bg-dark py-20 text-white md:py-28">
      <div className="absolute inset-0 bg-[#0b1220]" />
      <div className="absolute inset-0 bg-linear-to-r from-[#0b1220] via-[#111827] to-[#0f172a]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(37,99,235,0.18),transparent_24%)]" />
      <div className="absolute inset-0 bg-linear-to-b from-black/15 via-transparent to-black/45" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={
            image
              ? "grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,540px)] lg:gap-16"
              : "mx-auto max-w-4xl text-center"
          }
        >
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/90 backdrop-blur-md">
              <Sparkles size={14} className="text-primary" />
              Servicio especializado
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {safeText(service.titulo)}
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/76 md:text-base">
              {safeText(service.descripcion) ||
                safeText(service.descripcion_larga) ||
                "Servicio profesional orientado a brindar resultados con calidad, confianza y atención especializada."}
            </p>

            <div className={`mt-7 flex flex-wrap gap-3 ${image ? "" : "justify-center"}`}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white/90">
                <BadgeCheck size={14} className="text-primary" />
                Calidad profesional
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white/90">
                <ShieldCheck size={14} className="text-primary" />
                Atención personalizada
              </div>
            </div>

            <div className={`mt-10 flex flex-wrap gap-4 ${image ? "" : "justify-center"}`}>
              <CustomButton
                text="Solicitar este servicio"
                component={Link}
                to="/contacto"
                icon={<ArrowRight size={17} />}
                variant="primary"
                size="lg"
                className="w-full px-4! gap-1! sm:w-auto"
              />

              <CustomButton
                text="Volver a servicios"
                component={Link}
                to="/servicios"
                variant="secondary"
                size="lg"
                className="w-full px-4! gap-1! sm:w-auto"
              />
            </div>
          </motion.div>

          {image ? (
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-4xl border border-white/12 bg-white/6 shadow-[0_30px_90px_rgba(0,0,0,0.24)]">
                <img
                  src={image}
                  alt={safeText(service.titulo)}
                  className="h-[420px] w-full object-cover md:h-[520px]"
                />

                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55),transparent_42%)]" />

                <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30">
                  {serviceIcon}
                </div>

                <div className="absolute right-4 bottom-4 rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-xs font-semibold tracking-wide text-white/90 backdrop-blur-sm">
                  Solución a medida
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default ServicioDetalleHero;
