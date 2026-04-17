import {
  useMemo,
  useState,
  type FC,
  cloneElement,
  isValidElement,
} from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Wrench } from "lucide-react";

import { useAppState } from "@/hooks/useAppState";
import { getServiceIconMeta } from "@/shared/design/serviceIcons";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomInput } from "@/components/ui/kit/CustomInput";

import type { Service } from "@/interfaces/hook/IUseServices";

type ServiceCardItem = {
  id: string;
  slug: string;
  path: string;
  titulo: string;
  descripcion: string;
  descripcion_larga: string;
  icono: string;
  image_url: string;
  orden: number;
};

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
  const directImageUrl = buildAbsoluteUrl(
    safeText((service as Service & { image_url?: string }).image_url)
  );
  if (directImageUrl) return directImageUrl;

  const mediaUrl = buildAbsoluteUrl(safeText(service.media?.url));
  if (mediaUrl) return mediaUrl;

  return "";
};

const makeServicePath = (service: Pick<Service, "id"> & { slug?: string }): string => {
  const slug = safeText(service.slug);
  const id = safeText(service.id);

  if (slug) return `/servicios/${slug}`;
  if (id) return `/servicios/${id}`;
  return "/servicios";
};

const mapServiceToCardItem = (service: Service): ServiceCardItem | null => {
  const id = safeText(service.id);
  const titulo = safeText(service.titulo);

  if (!id || !titulo) return null;

  const slug = safeText((service as Service & { slug?: string }).slug) || id;

  return {
    id,
    slug,
    path: makeServicePath({ id, slug }),
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
          activos, válidos y correctamente registrados.
        </p>
      </div>
    </div>
  );
};

const ServiciosGrid: FC = () => {
  const { services } = useAppState();
  const [search, setSearch] = useState<string>("");

  const items = useMemo<ServiceCardItem[]>(() => {
    return (Array.isArray(services) ? services : [])
      .filter((service) => service?.activo !== false)
      .map((service) => mapServiceToCardItem(service))
      .filter((service): service is ServiceCardItem => service !== null)
      .sort((a, b) => {
        if (a.orden !== b.orden) return a.orden - b.orden;
        return a.titulo.localeCompare(b.titulo);
      });
  }, [services]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return items;

    return items.filter((service) => {
      const title = service.titulo.toLowerCase();
      const description = service.descripcion.toLowerCase();
      const detail = service.descripcion_larga.toLowerCase();

      return (
        title.includes(normalizedSearch) ||
        description.includes(normalizedSearch) ||
        detail.includes(normalizedSearch)
      );
    });
  }, [items, search]);

  if (!Array.isArray(services)) {
    return <ServicesSectionSkeleton />;
  }

  return (
    <section className="relative overflow-hidden bg-surface py-20 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_38%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
          <CustomInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar servicios por nombre o descripción..."
            fullWidth
          />

          <div className="flex items-center gap-2">
            <span className="inline-flex rounded-full border border-border bg-white px-3 py-2 text-xs font-semibold text-muted-foreground">
              {filteredItems.length} resultados
            </span>
            <CustomButton
              text="Limpiar"
              variant="secondary"
              size="sm"
              fontSize="12px"
              onClick={() => setSearch("")}
            />
          </div>
        </div>

        {items.length === 0 ? (
          <EmptyState />
        ) : filteredItems.length === 0 ? (
          <div className="rounded-3xl border border-border bg-white px-6 py-12 text-center">
            <h3 className="text-xl font-black text-dark">Sin resultados</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No encontramos servicios con ese criterio de búsqueda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((service, index) => {
              const iconMeta = getServiceIconMeta(service.icono);
              const iconElement = renderWhiteIcon(iconMeta?.icon);

              return (
                <motion.article
                  key={service.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.18 }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                  className="group overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden bg-dark">
                    {service.image_url ? (
                      <img
                        src={service.image_url}
                        alt={service.titulo}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-linear-to-br from-dark via-dark to-primary/50">
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md">
                          {iconElement}
                        </div>
                      </div>
                    )}

                    <div className="absolute left-5 top-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30">
                        {iconElement}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-black tracking-tight text-dark">
                      {service.titulo}
                    </h3>

                    <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {service.descripcion ||
                        service.descripcion_larga ||
                        "Servicio profesional disponible para atender tus necesidades con calidad y confianza."}
                    </p>

                    <div className="mt-8 flex items-center justify-between gap-3">
                      <Link
                        to={service.path}
                        className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-all duration-200 hover:gap-3"
                      >
                        Ver detalle
                        <ArrowRight size={16} />
                      </Link>

                      <CustomButton
                        text="Consultar"
                        component={Link}
                        to="/contacto"
                        variant="primary"
                        size="sm"
                        className="px-4!"
                      />
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiciosGrid;
