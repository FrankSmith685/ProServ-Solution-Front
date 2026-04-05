/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState, type FC, type ChangeEvent } from "react";
import {
  Wrench,
  FolderKanban,
  MessageSquare,
  Star,
  ArrowRight,
  TrendingUp,
  Clock3,
  Sparkles,
} from "lucide-react";

import { useServices } from "@/hooks/useServices";
import { useProjects } from "@/hooks/useProjects";
import { useContacts } from "@/hooks/useContacts";
import { useTestimonials } from "@/hooks/useTestimonials";

import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomInput } from "@/components/ui/kit/CustomInput";

import type { Contact } from "@/interfaces/hook/IUseContacts";
import type {
  AdminPageProps,
  DashboardCard,
  BuildDashboardData,
  GetContactStatusConfig,
  SortContactsByDate,
  CountActiveTestimonials,
} from "@/interfaces/page/admin/panel/IAdminPage";

const sortContactsByDate: SortContactsByDate = (contacts) => {
  return [...contacts].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

const countActiveTestimonials: CountActiveTestimonials = (testimonials) => {
  return testimonials.filter((testimonial) => testimonial.activo).length;
};

const getContactStatusConfig: GetContactStatusConfig = (estado) => {
  const safeStatus = estado || "nuevo";

  if (safeStatus === "nuevo") {
    return {
      className:
        "border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
      label: "nuevo",
    };
  }

  if (safeStatus === "leido") {
    return {
      className:
        "border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      label: "leído",
    };
  }

  if (safeStatus === "respondido") {
    return {
      className:
        "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      label: "respondido",
    };
  }

  if (safeStatus === "archivado") {
    return {
      className:
        "border border-border bg-muted text-muted-foreground",
      label: "archivado",
    };
  }

  if (safeStatus === "eliminado") {
    return {
      className:
        "border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
      label: "eliminado",
    };
  }

  return {
    className: "border border-border bg-muted text-muted-foreground",
    label: safeStatus,
  };
};

const buildDashboardData: BuildDashboardData = ({
  servicesCount,
  projectsCount,
  contactsCount,
  testimonialsCount,
  nuevosContactos,
}) => {
  return [
    {
      icon: Wrench,
      label: "Servicios",
      value: servicesCount,
      link: "/admin/servicios",
      description: "Gestiona lo que ofreces",
    },
    {
      icon: FolderKanban,
      label: "Proyectos",
      value: projectsCount,
      link: "/admin/proyectos",
      description: "Portafolio y casos",
    },
    {
      icon: MessageSquare,
      label: "Contactos",
      value: contactsCount,
      link: "/admin/contactos",
      badge: nuevosContactos,
      description: "Leads y consultas",
    },
    {
      icon: Star,
      label: "Testimonios",
      value: testimonialsCount,
      link: "/admin/testimonios",
      description: "Opiniones activas",
    },
  ] as unknown as DashboardCard[];
};

type DashboardCardExtended = DashboardCard & {
  description?: string;
};

type SummaryCard = {
  icon: typeof TrendingUp;
  title: string;
  text: string;
};

type StatCardProps = {
  item: DashboardCardExtended;
  index: number;
  isLoading: boolean;
};

const cardMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

const StatCard: FC<StatCardProps> = ({ item, index, isLoading }) => {
  const { icon: Icon, label, value, link, badge, description } = item;

  return (
    <motion.div
      {...cardMotion}
      transition={{ duration: 0.35, delay: index * 0.08 }}
    >
      <Link
        to={link}
        className="group relative block overflow-hidden rounded-3xl border border-border bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl sm:p-6"
      >
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
        </div>

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
            <Icon size={24} />
          </div>

          {typeof badge === "number" && badge > 0 && (
            <span className="shrink-0 rounded-full border border-primary/20 bg-primary px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              {badge} nuevo{badge > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="relative z-10 mt-5 space-y-1">
          <p className="text-sm font-semibold tracking-wide text-muted-foreground">
            {label}
          </p>

          <div className="flex items-end gap-2">
            <span className="font-montserrat text-3xl font-black leading-none text-primary sm:text-4xl">
              {isLoading ? "..." : value}
            </span>
          </div>

          {description && (
            <p className="text-xs text-muted-foreground sm:text-sm">
              {description}
            </p>
          )}
        </div>

        <div className="relative z-10 mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary/80 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary">
          Ir al módulo
          <ArrowRight size={14} />
        </div>
      </Link>
    </motion.div>
  );
};

const AdminPage: FC<AdminPageProps> = () => {
  const {
    getServices,
    services,
    loading: loadingServices,
  } = useServices();

  const {
    getProjects,
    projects,
    loading: loadingProjects,
  } = useProjects();

  const {
    getContacts,
    contacts,
    loading: loadingContacts,
  } = useContacts();

  const {
    getTestimonials,
    testimonials,
    loading: loadingTestimonials,
  } = useTestimonials();

  const [search, setSearch] = useState<string>("");

  useEffect((): void => {
    getServices();
    getProjects();
    getContacts();
    getTestimonials();
  }, []);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearch(event.target.value);
  };

  const recientes = useMemo<Contact[]>(() => {
    return sortContactsByDate(contacts).slice(0, 8);
  }, [contacts]);

  const recientesFiltrados = useMemo<Contact[]>(() => {
    const term = search.trim().toLowerCase();

    if (!term) return recientes;

    return recientes.filter((contact) => {
      const nombre = contact.nombre?.toLowerCase() ?? "";
      const email = contact.email?.toLowerCase() ?? "";
      const servicio = contact.service?.titulo?.toLowerCase() ?? "";
      const estado = (contact.estado || "nuevo").toLowerCase();

      return (
        nombre.includes(term) ||
        email.includes(term) ||
        servicio.includes(term) ||
        estado.includes(term)
      );
    });
  }, [recientes, search]);

  const nuevosContactos = useMemo<number>(() => {
    return contacts.filter(
      (contact) => !contact.estado || contact.estado === "nuevo"
    ).length;
  }, [contacts]);

  const totalTestimonialsActivos = useMemo<number>(() => {
    return countActiveTestimonials(testimonials);
  }, [testimonials]);

  const isLoading: boolean =
    loadingServices ||
    loadingProjects ||
    loadingContacts ||
    loadingTestimonials;

  const data = useMemo<DashboardCardExtended[]>(() => {
    return buildDashboardData({
      servicesCount: services.length,
      projectsCount: projects.length,
      contactsCount: contacts.length,
      testimonialsCount: totalTestimonialsActivos,
      nuevosContactos,
    });
  }, [
    services.length,
    projects.length,
    contacts.length,
    totalTestimonialsActivos,
    nuevosContactos,
  ]);

  const summaryCards = useMemo<SummaryCard[]>(
    () => [
      {
        icon: TrendingUp,
        title: "Panel optimizado",
        text: "Vista moderna, clara y preparada para escritorio y móvil.",
      },
      {
        icon: Sparkles,
        title: "Tema dinámico",
        text: "Usa el primary del sistema: azul en light y naranja en dark.",
      },
      {
        icon: Clock3,
        title: "Seguimiento rápido",
        text: "Accede a métricas y contactos recientes desde un solo lugar.",
      },
    ],
    []
  );

  return (
    <div className="animate-fade-in space-y-6 sm:space-y-8">
      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-[28px] border border-border bg-surface px-5 py-6 shadow-sm sm:px-7 sm:py-8 lg:px-8 lg:py-9"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.10),transparent_24%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.12),transparent_24%)]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.4fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <Sparkles size={14} />
              Dashboard Administrativo
            </div>

            <h2 className="max-w-3xl font-montserrat text-2xl font-black leading-tight text-primary sm:text-3xl xl:text-4xl">
              Bienvenido al panel de control
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Administra servicios, proyectos, contactos y testimonios desde una
              interfaz más moderna, visual y profesional, adaptada tanto a tema
              claro como oscuro.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <CustomButton
                text="Ver contactos"
                component={Link}
                to="/admin/contactos"
                variant="primary"
                size="md"
                icon={<ArrowRight size={16} />}
                className="shadow-md! px-4! gap-1!"
              />

              <CustomButton
                text="Gestionar proyectos"
                component={Link}
                to="/admin/proyectos"
                variant="primary-outline"
                size="md"
                className="px-4! gap-1!"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {summaryCards.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-surface-soft p-4 backdrop-blur-sm"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={20} />
                </div>

                <h3 className="text-sm font-bold text-primary">{title}</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* STATS */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.map((item, index) => (
          <StatCard
            key={item.label}
            item={item}
            index={index}
            isLoading={isLoading}
          />
        ))}
      </section>

      {/* CONTACTOS */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.12 }}
        className="overflow-hidden rounded-[28px] border border-border bg-surface shadow-sm"
      >
        <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-montserrat text-lg font-extrabold text-primary sm:text-xl">
                Contactos recientes
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Revisa las últimas consultas recibidas desde el sitio web.
              </p>
            </div>

            <CustomButton
              text="Ver todos"
              component={Link}
              to="/admin/contactos"
              variant="secondary-outline"
              size="md"
              icon={<ArrowRight size={15} />}
              className="w-full! sm:w-auto! px-4!"
            />
          </div>

          {!loadingContacts && recientes.length > 0 && (
            <div className="w-full lg:max-w-md">
              <CustomInput
                name="searchRecentContacts"
                value={search}
                onChange={handleSearchChange}
                placeholder="Buscar por nombre, correo, servicio o estado"
                type="search"
                label="Buscar"
                fullWidth
                variant="primary"
                size="md"
              />
            </div>
          )}
        </div>

        {loadingContacts ? (
          <div className="px-5 py-12 text-center sm:px-6">
            <p className="text-sm text-muted-foreground">
              Cargando contactos...
            </p>
          </div>
        ) : recientes.length === 0 ? (
          <div className="px-5 py-12 text-center sm:px-6">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MessageSquare size={24} />
            </div>

            <h4 className="text-sm font-bold text-primary sm:text-base">
              No hay contactos aún
            </h4>

            <p className="mt-1 text-sm text-muted-foreground">
              Cuando lleguen nuevos mensajes aparecerán aquí.
            </p>
          </div>
        ) : recientesFiltrados.length === 0 ? (
          <div className="px-5 py-12 text-center sm:px-6">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MessageSquare size={24} />
            </div>

            <h4 className="text-sm font-bold text-primary sm:text-base">
              Sin resultados
            </h4>

            <p className="mt-1 text-sm text-muted-foreground">
              No se encontraron contactos recientes con esa búsqueda.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recientesFiltrados.map((contact, index) => {
              const status = getContactStatusConfig(contact.estado);

              return (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-muted/40 sm:px-6 md:flex-row md:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 font-extrabold uppercase text-primary shadow-sm">
                        {contact.nombre?.[0] || "?"}
                      </div>

                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold text-primary sm:text-base">
                          {contact.nombre}
                        </div>

                        <div className="mt-1 flex flex-col gap-1 text-xs text-muted-foreground sm:text-sm lg:flex-row lg:items-center lg:gap-2">
                          <span className="truncate">{contact.email}</span>
                          <span className="hidden lg:inline">•</span>
                          <span className="truncate">
                            {contact.service?.titulo || "Sin servicio"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 md:justify-end">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${status.className}`}
                    >
                      {status.label}
                    </span>

                    <CustomButton
                      text="Ver"
                      component={Link}
                      to="/admin/contactos"
                      variant="secondary-outline"
                      size="sm"
                      className="min-w-19"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.section>
    </div>
  );
};

export default AdminPage;