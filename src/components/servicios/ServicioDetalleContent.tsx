import {
  useMemo,
  type FC,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { useAppState } from "@/hooks/useAppState";
import { CustomButton } from "@/components/ui/kit/CustomButton";

import type { Service } from "@/interfaces/hook/IUseServices";

type ServiceView = {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string;
  descripcionLarga: string;
  icono: string;
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

const normalizePhone = (value?: string | null): string => {
  return (value ?? "").replace(/[^\d+]/g, "");
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

const mapServiceToView = (service: Service): ServiceView | null => {
  const id = safeText(service.id);
  const titulo = safeText(service.titulo);

  if (!id || !titulo) return null;

  const explicitSlug = safeText((service as Service & { slug?: string }).slug);

  return {
    id,
    slug: explicitSlug || makeSlug(titulo),
    titulo,
    descripcion: safeText(service.descripcion),
    descripcionLarga: safeText(service.descripcion_larga),
    icono: safeText(service.icono),
    orden: safeNumber(service.orden, 9999),
  };
};

const collectDetailPoints = (service: ServiceView): string[] => {
  const candidates = [service.descripcion, service.descripcionLarga]
    .join(". ")
    .split(/[\n•]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  const unique = Array.from(new Set(candidates));

  return unique.slice(0, 6);
};

const EmptyState: FC = () => {
  return (
    <section className="relative overflow-hidden bg-surface py-20 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_38%)]" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <div className="rounded-4xl border border-border bg-white p-8 text-center shadow-sm md:p-12">
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <Sparkles size={14} />
            Servicio no encontrado
          </div>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-dark md:text-4xl">
            No encontramos este servicio
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            El servicio que intentas ver no existe, no está activo o su ruta cambió.
          </p>

          <div className="mt-8 flex justify-center">
            <CustomButton
              text="Ver todos los servicios"
              component={Link}
              to="/servicios"
              icon={<ArrowRight size={17} />}
              variant="primary"
              size="lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const ServiceInfoCard: FC<{
  label: string;
  value: string;
  icon: ReactNode;
}> = ({ label, value, icon }) => {
  if (!value) return null;

  return (
    <div className="rounded-[1.6rem] border border-border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white">
          {icon}
        </div>
        <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>

      <p className="mt-4 text-base font-black tracking-tight text-dark">
        {value}
      </p>
    </div>
  );
};

const DetailPointCard: FC<{
  text: string;
  index: number;
}> = ({ text, index }) => {
  const icons = [
    <CheckCircle2 key="check" size={18} />,
    <ShieldCheck key="shield" size={18} />,
    <BadgeCheck key="badge" size={18} />,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="rounded-3xl border border-border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
        {icons[index % icons.length]}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
        {text}
      </p>
    </motion.div>
  );
};

const ServicioDetalleContent: FC = () => {
  const { slug } = useParams();
  const { services, company, siteConfig } = useAppState();

  const service = useMemo<ServiceView | null>(() => {
    const items =
      (Array.isArray(services) ? services : [])
        .filter((item) => item?.activo !== false)
        .map((item) => mapServiceToView(item))
        .filter((item): item is ServiceView => item !== null)
        .sort((a, b) => {
          if (a.orden !== b.orden) return a.orden - b.orden;
          return a.titulo.localeCompare(b.titulo);
        });

    const cleanSlug = safeText(slug);

    if (!cleanSlug) return null;

    return (
      items.find((item) => item.slug === cleanSlug) ||
      items.find((item) => item.id === cleanSlug) ||
      items.find((item) => makeSlug(item.titulo) === cleanSlug) ||
      null
    );
  }, [services, slug]);

  const points = useMemo(() => {
    if (!service) return [];
    return collectDetailPoints(service);
  }, [service]);

  const companyName =
    safeText(company?.nombre) ||
    safeText(siteConfig?.site_name) ||
    "Nuestra empresa";

  const contactPhone =
    safeText(siteConfig?.contact_phone) || safeText(company?.telefono);

  const phoneHref = normalizePhone(contactPhone);

  if (!service) {
    return <EmptyState />;
  }

  const hasLongContent = Boolean(service.descripcionLarga);
  const hasPhone = Boolean(phoneHref);

  return (
    <section className="relative overflow-hidden bg-surface py-20 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_36%)]" />
      <div className="absolute -left-16 top-12 h-52 w-52 rounded-full bg-primary/8 blur-3xl" />
      <div className="absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-primary/8 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="grid gap-6 xl:grid-cols-12"
        >
          <div className="xl:col-span-8">
            {hasLongContent ? (
              <div className="rounded-[1.8rem] border border-border bg-white p-6 shadow-sm md:p-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  <Sparkles size={14} />
                  Descripción del servicio
                </div>

                <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-muted-foreground md:text-base">
                  {service.descripcionLarga}
                </p>
              </div>
            ) : service.descripcion ? (
              <div className="rounded-[1.8rem] border border-border bg-white p-6 shadow-sm md:p-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  <Sparkles size={14} />
                  Resumen del servicio
                </div>

                <p className="mt-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {service.descripcion}
                </p>
              </div>
            ) : null}

            {points.length > 0 ? (
              <div className="mt-8">
                <h2 className="text-2xl font-black tracking-tight text-dark md:text-3xl">
                  Lo que incluye este servicio
                </h2>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {points.map((point, index) => (
                    <DetailPointCard
                      key={`${point}-${index}`}
                      text={point}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-8">
              <h2 className="text-2xl font-black tracking-tight text-dark md:text-3xl">
                Información adicional
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <ServiceInfoCard
                  label="Empresa"
                  value={companyName}
                  icon={<Building2 size={18} />}
                />

                <ServiceInfoCard
                  label="Servicio"
                  value={service.titulo}
                  icon={<BadgeCheck size={18} />}
                />

                <ServiceInfoCard
                  label="Contacto"
                  value={contactPhone}
                  icon={<Phone size={18} />}
                />
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <CustomButton
                text="Ver todos los servicios"
                component={Link}
                to="/servicios"
                icon={<ArrowRight size={17} />}
                variant="primary"
                size="lg"
                className="px-4! gap-1!"
              />

              {phoneHref ? (
                <CustomButton
                  text="Solicitar información"
                  component="a"
                  href={`tel:${phoneHref}`}
                  icon={<Phone size={17} />}
                  variant="secondary"
                  size="lg"
                  className="px-4! gap-1!"
                />
              ) : (
                <CustomButton
                  text="Ir a contacto"
                  component={Link}
                  to="/contacto"
                  variant="secondary"
                  size="lg"
                  className="px-4! gap-1!"
                />
              )}
            </div>
          </div>

          <aside className="xl:col-span-4">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-[1.6rem] border border-border bg-white p-5 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                  Resumen rápido
                </p>
                <h3 className="mt-2 text-lg font-black text-dark">
                  Cotización clara y profesional
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Te guiamos con alcance, alternativas y próximos pasos para que
                  tomes una decisión con confianza.
                </p>
              </div>

              <div className="rounded-[1.6rem] border border-border bg-white p-5 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-2xl bg-primary/5 px-3 py-2">
                    <Timer size={16} className="text-primary" />
                    <p className="text-sm font-semibold text-dark">
                      Respuesta inicial rápida
                    </p>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-primary/5 px-3 py-2">
                    <ClipboardCheck size={16} className="text-primary" />
                    <p className="text-sm font-semibold text-dark">
                      Alcance y propuesta estructurada
                    </p>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-primary/5 px-3 py-2">
                    <MessageCircle size={16} className="text-primary" />
                    <p className="text-sm font-semibold text-dark">
                      Comunicación en todo el proceso
                    </p>
                  </div>
                </div>
              </div>

              {hasPhone ? (
                <CustomButton
                  text="Llamar ahora"
                  component="a"
                  href={`tel:${phoneHref}`}
                  icon={<Phone size={17} />}
                  variant="primary"
                  size="lg"
                  className="w-full! justify-center gap-1!"
                />
              ) : null}

              <CustomButton
                text="Solicitar cotización"
                component={Link}
                to="/contacto"
                icon={<ArrowRight size={17} />}
                variant="secondary"
                size="lg"
                className="w-full! justify-center gap-1!"
              />
            </div>
          </aside>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicioDetalleContent;
