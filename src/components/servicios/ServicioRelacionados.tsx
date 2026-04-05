import {
  useMemo,
  type FC,
  cloneElement,
  isValidElement,
} from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Wrench } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { useAppState } from "@/hooks/useAppState";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { getServiceIconMeta } from "@/shared/design/serviceIcons";

import type { Service } from "@/interfaces/hook/IUseServices";

type ServiceCardItem = {
  id: string;
  slug: string;
  path: string;
  titulo: string;
  descripcion: string;
  imageUrl: string;
  icono: string;
  orden: number;
};

const MAX_RELATED_SERVICES = 3;

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

  const explicitSlug = safeText((service as Service & { slug?: string }).slug);
  const slug = explicitSlug || makeSlug(titulo);

  return {
    id,
    slug,
    path: makeServicePath({ id, slug }),
    titulo,
    descripcion: safeText(service.descripcion),
    imageUrl: getServiceImage(service),
    icono: safeText(service.icono),
    orden: safeNumber(service.orden, 9999),
  };
};

const renderIcon = (
  icon: unknown,
  className = "text-white",
  size = 22
) => {
  if (isValidElement<{ className?: string; size?: number }>(icon)) {
    return cloneElement(icon, {
      size,
      className,
    });
  }

  return <Wrench size={size} className={className} />;
};

const EmptyState: FC = () => {
  return null;
};

const RelatedServiceCard: FC<{
  service: ServiceCardItem;
  index: number;
}> = ({ service, index }) => {
  const iconMeta = getServiceIconMeta(service.icono);
  const mainIcon = renderIcon(iconMeta?.icon, "text-white", 30);
  const smallIcon = renderIcon(iconMeta?.icon, "text-white", 20);

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="group overflow-hidden rounded-[1.9rem] border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {service.imageUrl ? (
        <div className="relative h-60 overflow-hidden bg-dark">
          <img
            src={service.imageUrl}
            alt={service.titulo}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.40),transparent_48%)]" />
        </div>
      ) : (
        <div className="flex h-60 items-center justify-center bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.10),transparent_45%)]">
          <div className="flex h-18 w-18 items-center justify-center rounded-[1.4rem] bg-primary text-white shadow-lg shadow-primary/20">
            {mainIcon}
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
            {smallIcon}
          </div>

          <h3 className="line-clamp-2 text-lg font-black tracking-tight text-dark">
            {service.titulo}
          </h3>
        </div>

        {service.descripcion ? (
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {service.descripcion}
          </p>
        ) : (
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            Servicio profesional disponible para atender tus necesidades con calidad y confianza.
          </p>
        )}

        <div className="mt-6">
          <Link
            to={service.path}
            className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-all duration-200 hover:gap-3"
          >
            Ver detalle
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

const ServiciosRelacionados: FC = () => {
  const { slug } = useParams();
  const { services } = useAppState();

  const relatedServices = useMemo(() => {
    const items =
      (Array.isArray(services) ? services : [])
        .filter((item) => item?.activo !== false)
        .map((item) => mapServiceToCardItem(item))
        .filter((item): item is ServiceCardItem => item !== null)
        .sort((a, b) => {
          if (a.orden !== b.orden) return a.orden - b.orden;
          return a.titulo.localeCompare(b.titulo);
        });

    const currentSlug = safeText(slug);

    return items
      .filter((item) => item.slug !== currentSlug && item.id !== currentSlug)
      .slice(0, MAX_RELATED_SERVICES);
  }, [services, slug]);

  if (relatedServices.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className="relative overflow-hidden bg-surface py-20 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_38%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto mb-14 max-w-3xl text-center md:mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            <Sparkles size={14} />
            Más soluciones para ti
          </div>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-dark sm:text-4xl md:text-5xl">
            Servicios relacionados
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Explora otras opciones disponibles dentro de nuestro portafolio de servicios.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {relatedServices.map((service, index) => (
            <RelatedServiceCard
              key={service.id}
              service={service}
              index={index}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <CustomButton
            text="Ver todos los servicios"
            component={Link}
            to="/servicios"
            icon={<ArrowRight size={17} />}
            variant="primary"
            size="lg"
            className="px-4! gap-1!"
          />
        </div>
      </div>
    </section>
  );
};

export default ServiciosRelacionados;