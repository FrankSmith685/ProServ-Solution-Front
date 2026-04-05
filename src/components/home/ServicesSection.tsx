import {
  useMemo,
  type FC,
  cloneElement,
  isValidElement,
} from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Wrench } from "lucide-react";

import { useServices } from "@/hooks/useServices";
import { useAppState } from "@/hooks/useAppState";
import { getServiceIconMeta } from "@/shared/design/serviceIcons";
import { CustomButton } from "@/components/ui/kit/CustomButton";

import type { Service } from "@/interfaces/hook/IUseServices";

type ServiceCardItem = {
  id: string;
  titulo: string;
  descripcion: string;
  descripcion_larga: string;
  icono: string;
  image_url: string;
  orden: number;
};

const MAX_VISIBLE_SERVICES = 6;

const safeText = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value).trim();
  return "";
};

const safeNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  return fallback;
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
  const directImageUrl = buildAbsoluteUrl(safeText(service.image_url));
  if (directImageUrl) return directImageUrl;

  const mediaUrl = buildAbsoluteUrl(safeText(service.media?.url));
  if (mediaUrl) return mediaUrl;

  return "";
};

const mapServiceToCardItem = (service: Service): ServiceCardItem | null => {
  const id = safeText(service.id);
  const titulo = safeText(service.titulo);

  if (!id || !titulo) {
    return null;
  }

  return {
    id,
    titulo,
    descripcion: safeText(service.descripcion),
    descripcion_larga: safeText(service.descripcion_larga),
    icono: safeText(service.icono),
    image_url: getServiceImage(service),
    orden: safeNumber(service.orden, 9999),
  };
};

const renderWhiteIcon = (icon: unknown) => {
  if (isValidElement<{ className?: string; size?: number }>(icon)) {
    return cloneElement(icon, {
      size: 22,
      className: "text-white",
    });
  }

  return <Wrench size={22} className="text-white" />;
};

const ServicesSectionSkeleton: FC = () => {
  return (
    <section className="relative overflow-hidden bg-surface py-20 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_38%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-14 max-w-3xl text-center md:mb-16">
          <div className="mx-auto h-8 w-36 animate-pulse rounded-full bg-primary/10" />
          <div className="mx-auto mt-5 h-10 w-64 animate-pulse rounded-2xl bg-primary/10 sm:w-80" />
          <div className="mx-auto mt-4 h-4 w-full max-w-xl animate-pulse rounded-full bg-muted" />
          <div className="mx-auto mt-3 h-4 w-4/5 max-w-md animate-pulse rounded-full bg-muted" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`service-skeleton-${index}`}
              className="overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-sm"
            >
              <div className="h-56 animate-pulse bg-primary/10" />
              <div className="p-6">
                <div className="h-6 w-2/3 animate-pulse rounded-full bg-primary/10" />
                <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-muted" />
                <div className="mt-3 h-4 w-5/6 animate-pulse rounded-full bg-muted" />
                <div className="mt-3 h-4 w-4/6 animate-pulse rounded-full bg-muted" />

                <div className="mt-8 flex items-center justify-between">
                  <div className="h-4 w-28 animate-pulse rounded-full bg-primary/10" />
                  <div className="h-8 w-14 animate-pulse rounded-full bg-primary/10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const EmptyState: FC = () => {
  return (
    <div className="relative overflow-hidden rounded-4xl border border-border bg-surface px-6 py-14 text-center shadow-sm md:px-10 md:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.1),transparent_42%)]" />
      <div className="absolute -left-16 top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-16 bottom-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative">
        <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-[1.4rem] bg-primary shadow-lg shadow-primary/25 ring-8 ring-primary/10">
          <Wrench size={30} className="text-white" />
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          <Sparkles size={14} />
          Sin contenido disponible
        </div>

        <h3 className="mt-5 text-2xl font-black tracking-tight text-dark md:text-3xl">
          Aún no hay servicios publicados
        </h3>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Esta sección se llenará automáticamente cuando existan servicios
          activos, válidos y correctamente registrados desde la base de datos.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary">
            Datos reales del backend
          </div>
          <div className="rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold text-muted-foreground">
            Render dinámico
          </div>
        </div>
      </div>
    </div>
  );
};

const ServicesSectionHeader: FC<{
  title: string;
  total: number;
}> = ({ title, total }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="mx-auto mb-14 max-w-3xl text-center md:mb-16"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
        <Sparkles size={14} />
        Lo que hacemos
      </div>

      <h2 className="mt-5 text-3xl font-black tracking-tight text-dark sm:text-4xl md:text-5xl">
        {title}
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
        Descubre nuestros servicios profesionales con una presentación moderna,
        clara y conectada directamente a la información real registrada en tu
        sistema.
      </p>

      {total > 0 ? (
        <div className="mt-6 inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-bold text-primary">
          {total} servicio{total === 1 ? "" : "s"} disponible
          {total === 1 ? "" : "s"}
        </div>
      ) : null}
    </motion.div>
  );
};

const ServicesSection: FC = () => {
  const { services, configHome } = useAppState();
  const { loading } = useServices();


  const sectionTitle = useMemo<string>(() => {
    return safeText(configHome?.services_title) || "Nuestros servicios";
  }, [configHome]);

  const serviceList = useMemo<ServiceCardItem[]>(() => {
    return (services ?? [])
      .filter((service) => service?.activo === true)
      .map((service) => mapServiceToCardItem(service))
      .filter((service): service is ServiceCardItem => service !== null)
      .sort((a, b) => a.orden - b.orden);
  }, [services]);

  const visibleServices = useMemo<ServiceCardItem[]>(() => {
    return serviceList.slice(0, MAX_VISIBLE_SERVICES);
  }, [serviceList]);

  const hiddenServicesCount = useMemo<number>(() => {
    return Math.max(serviceList.length - MAX_VISIBLE_SERVICES, 0);
  }, [serviceList.length]);

  if (loading && !serviceList.length) {
    return <ServicesSectionSkeleton />;
  }

  return (
    <section className="relative overflow-hidden bg-surface py-20 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_35%)]" />
      <div className="absolute left-0 top-20 h-52 w-52 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute right-0 top-1/3 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <ServicesSectionHeader
          title={sectionTitle}
          total={serviceList.length}
        />

        {!serviceList.length ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleServices.map((service, index) => {
                const iconMeta = getServiceIconMeta(service.icono);
                const description =
                  service.descripcion || service.descripcion_larga;

                return (
                  <motion.article
                    key={service.id}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                    className="group relative flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {service.image_url ? (
                      <div className="relative h-56 overflow-hidden sm:h-60">
                        <img
                          src={service.image_url}
                          alt={service.titulo}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />

                        <div className="absolute inset-0 bg-linear-to-t from-secondary/90 via-secondary/35 to-transparent" />

                        <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md sm:left-5 sm:top-5">
                          Servicio #{service.orden}
                        </div>

                        <div className="absolute bottom-5 left-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/30 ring-4 ring-white/20">
                          {renderWhiteIcon(iconMeta?.icon)}
                        </div>
                      </div>
                    ) : (
                      <div className="relative flex h-56 items-end overflow-hidden bg-linear-to-br from-primary/12 via-white to-primary/5 p-5 sm:h-60 sm:p-6">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.18),transparent_36%)]" />
                        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
                        <div className="absolute bottom-0 left-0 h-24 w-full bg-linear-to-t from-primary/5 to-transparent" />

                        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/25">
                          {renderWhiteIcon(iconMeta?.icon)}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <h3 className="line-clamp-2 text-xl font-black leading-snug tracking-tight text-dark">
                          {service.titulo}
                        </h3>

                        <div className="shrink-0 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
                          Activo
                        </div>
                      </div>

                      <p className="line-clamp-4 min-h-24 flex-1 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                        {description ||
                          "Servicio disponible para atención profesional, eficiente y personalizada según la información registrada en el sistema."}
                      </p>

                      <div className="mt-7 flex items-center justify-between gap-4 border-t border-border pt-5">
                        <Link
                          to="/servicios"
                          className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-all duration-200 hover:gap-3"
                        >
                          Ver servicio
                          <ArrowRight size={16} />
                        </Link>

                        <div className="inline-flex items-center rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-primary/20">
                          #{service.orden}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 md:mt-12">
              {hiddenServicesCount > 0 ? (
                <div className="rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-center text-xs font-bold text-primary sm:text-sm">
                  +{hiddenServicesCount} servicio
                  {hiddenServicesCount === 1 ? "" : "s"} más disponible
                  {hiddenServicesCount === 1 ? "" : "s"}
                </div>
              ) : null}

              <CustomButton
                text="Ver todos los servicios"
                variant="primary"
                size="lg"
                icon={<ArrowRight size={18} />}
                component={Link}
                to="/servicios"
                className="min-w-60! px-4! gap-1!"
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;