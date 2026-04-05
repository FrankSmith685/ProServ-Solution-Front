/* eslint-disable react-hooks/set-state-in-effect */
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Phone,
  ChevronDown,
  HardHat,
  MapPin,
  Clock3,
  ArrowRight,
  Mail,
  Sparkles,
  BriefcaseBusiness,
  FolderKanban,
  Home,
  Building2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useAppState } from "@/hooks/useAppState";

import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomChip } from "@/components/ui/kit/CustomChip";

import type { Service } from "@/interfaces/hook/IUseServices";
import type { Project } from "@/interfaces/hook/IUseProjects";

type DropdownItem = {
  label: string;
  path: string;
};

type NavLink = {
  label: string;
  path: string;
  icon?: ReactNode;
  dropdown?: DropdownItem[];
};

const cleanText = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value).trim();
  return "";
};

const cleanPhoneHref = (value: string): string => {
  return value.replace(/[^\d+]/g, "");
};

const safeArray = <T,>(value: T[] | null | undefined): T[] => {
  return Array.isArray(value) ? value : [];
};

const buildAbsoluteUrl = (url: string): string => {
  const cleanUrl = cleanText(url);
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

const getCompanyLogoUrl = (company: unknown): string => {
  if (!company || typeof company !== "object") return "";

  const source = company as {
    logo?: { url?: string | null } | null;
    logo_media?: { url?: string | null } | null;
    media?: { url?: string | null } | null;
    logo_url?: string | null;
  };

  return (
    buildAbsoluteUrl(cleanText(source.logo?.url)) ||
    buildAbsoluteUrl(cleanText(source.logo_media?.url)) ||
    buildAbsoluteUrl(cleanText(source.media?.url)) ||
    buildAbsoluteUrl(cleanText(source.logo_url))
  );
};

const getScheduleText = (siteConfig: unknown): string => {
  if (!siteConfig || typeof siteConfig !== "object") return "";

  const source = siteConfig as Record<string, unknown>;

  const candidates = [
    source["horario"],
    source["horario_atencion"],
    source["topbar_horario"],
    source["schedule"],
    source["business_hours"],
  ];

  for (const candidate of candidates) {
    const value = cleanText(candidate);
    if (value) return value;
  }

  return "";
};

const iconMap: Record<string, ReactNode> = {
  Inicio: <Home size={18} />,
  Nosotros: <Building2 size={18} />,
  Servicios: <BriefcaseBusiness size={18} />,
  Proyectos: <FolderKanban size={18} />,
  Contacto: <Mail size={18} />,
};

const NavbarTopBar = memo(
  ({
    scheduleText,
    companyAddress,
    companyPhone,
  }: {
    scheduleText: string;
    companyAddress: string;
    companyPhone: string;
  }) => {
    const hasTopBar = Boolean(scheduleText || companyAddress || companyPhone);

    if (!hasTopBar) return null;

    return (
      <div className="hidden border-b border-white/10 bg-dark text-on-dark md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-2.5">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            {scheduleText ? (
              <div className="rounded-full border border-white/10 bg-white/5">
                <CustomChip
                  label={scheduleText}
                  clickable={false}
                  icon={<Clock3 size={14} className="text-primary" />}
                  variant="secondary-outline"
                  className="border-white/0! bg-transparent! text-white!"
                />
              </div>
            ) : null}

            {companyAddress ? (
              <div className="inline-flex min-w-0 items-center gap-2 text-xs text-white/80">
                <MapPin size={13} className="shrink-0 text-primary" />
                <span className="line-clamp-1">{companyAddress}</span>
              </div>
            ) : null}
          </div>

          {companyPhone ? (
            <a
              href={`tel:${cleanPhoneHref(companyPhone)}`}
              className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold text-white/85 transition-colors duration-200 hover:text-primary"
            >
              <Phone size={13} className="text-primary" />
              <span>{companyPhone}</span>
            </a>
          ) : null}
        </div>
      </div>
    );
  }
);

NavbarTopBar.displayName = "NavbarTopBar";

const NavbarBrand = memo(
  ({
    logoUrl,
    companyName,
    companyPhone,
  }: {
    logoUrl: string;
    companyName: string;
    companyPhone: string;
  }) => {
    return (
      <Link to="/" className="group flex min-w-0 items-center gap-3">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md sm:h-12 sm:w-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_55%)]" />

          {logoUrl ? (
            <img
              src={logoUrl}
              alt={companyName || "Logo"}
              loading="eager"
              decoding="async"
              className="relative h-full w-full object-cover"
            />
          ) : (
            <HardHat size={22} className="relative text-primary sm:size-6" />
          )}
        </div>

        <div className="min-w-0">
          <div className="truncate text-sm font-black leading-none tracking-tight text-dark sm:text-lg">
            {companyName || "Tu empresa"}
          </div>

          <div className="mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-primary sm:text-xs">
            {companyPhone || "Servicio profesional"}
          </div>
        </div>
      </Link>
    );
  }
);

NavbarBrand.displayName = "NavbarBrand";

const DesktopNav = memo(
  ({
    navLinks,
    dropdown,
    onOpenDropdown,
    onCloseDropdown,
    pathname,
  }: {
    navLinks: NavLink[];
    dropdown: string | null;
    onOpenDropdown: (label: string) => void;
    onCloseDropdown: () => void;
    pathname: string;
  }) => {
    const isPathActive = (path: string): boolean => {
      if (path === "/") return pathname === "/";
      return pathname === path || pathname.startsWith(`${path}/`);
    };

    return (
      <nav className="hidden items-center gap-1 lg:flex">
        {navLinks.map((link) => {
          const linkActive = isPathActive(link.path);

          return (
            <div
              key={link.path}
              className="relative"
              onMouseEnter={() => {
                if (link.dropdown) onOpenDropdown(link.label);
              }}
              onMouseLeave={onCloseDropdown}
            >
              <Link
                to={link.path}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200 ${
                  linkActive
                    ? "bg-primary/10 text-primary"
                    : "text-dark hover:bg-primary/5 hover:text-primary"
                }`}
              >
                {link.label}

                {link.dropdown ? (
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-200 ${
                      dropdown === link.label ? "rotate-180" : ""
                    }`}
                  />
                ) : null}
              </Link>

              <AnimatePresence>
                {link.dropdown && dropdown === link.label ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full z-160 mt-3 w-80 overflow-hidden rounded-3xl border border-border bg-surface p-2 shadow-[0_22px_60px_rgba(0,0,0,0.12)]"
                  >
                    {link.dropdown.length > 0 ? (
                      <>
                        <div className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                          {link.path === "/servicios"
                            ? "Servicios disponibles"
                            : "Proyectos disponibles"}
                        </div>

                        <div className="max-h-95 overflow-y-auto pr-1">
                          {link.dropdown.map((item) => (
                            <Link
                              key={`${item.path}-${item.label}`}
                              to={item.path}
                              className="group flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-semibold text-dark transition-all duration-200 hover:bg-primary/5 hover:text-primary"
                            >
                              <span className="line-clamp-1">{item.label}</span>
                              <ArrowRight
                                size={15}
                                className="opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                              />
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="px-3 py-3 text-sm text-muted-foreground">
                        No hay elementos registrados.
                      </div>
                    )}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    );
  }
);

DesktopNav.displayName = "DesktopNav";

const MobileDrawerItem = memo(
  ({
    label,
    path,
    icon,
    items,
    active,
    open,
    onToggle,
    onNavigate,
  }: {
    label: string;
    path: string;
    icon?: ReactNode;
    items?: DropdownItem[];
    active: boolean;
    open: boolean;
    onToggle: () => void;
    onNavigate: () => void;
  }) => {
    const hasItems = Array.isArray(items) && items.length > 0;

    return (
      <div className="overflow-hidden rounded-[1.4rem] border border-border bg-white shadow-sm">
        <div className="flex items-center">
          <Link
            to={path}
            onClick={onNavigate}
            className={`flex min-w-0 flex-1 items-center gap-3 px-4 py-4 text-sm font-bold transition-all duration-200 ${
              active
                ? "bg-primary/10 text-primary"
                : "text-dark hover:bg-primary/5 hover:text-primary"
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all duration-200 ${
                active
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-surface text-primary"
              }`}
            >
              {icon}
            </div>

            <span className="truncate">{label}</span>
          </Link>

          {hasItems ? (
            <button
              type="button"
              onClick={onToggle}
              className="mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-dark transition-all duration-200 hover:bg-primary/5 hover:text-primary"
              aria-label={open ? `Cerrar ${label}` : `Abrir ${label}`}
            >
              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${
                  open ? "rotate-180 text-primary" : ""
                }`}
              />
            </button>
          ) : null}
        </div>

        <AnimatePresence initial={false}>
          {hasItems && open ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-border bg-surface/70"
            >
              <div className="max-h-72 space-y-1 overflow-y-auto px-3 py-3">
                {items.map((item) => (
                  <Link
                    key={`${item.path}-${item.label}`}
                    to={item.path}
                    onClick={onNavigate}
                    className="group flex items-center justify-between rounded-xl bg-white px-3 py-3 text-xs font-semibold text-muted-foreground shadow-sm transition-all duration-200 hover:bg-primary/5 hover:text-primary"
                  >
                    <span className="line-clamp-1">{item.label}</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </Link>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }
);

MobileDrawerItem.displayName = "MobileDrawerItem";

const MobileMenu = memo(
  ({
    mobileOpen,
    navLinks,
    companyName,
    companyPhone,
    companyEmail,
    companyAddress,
    logoUrl,
    pathname,
    onClose,
  }: {
    mobileOpen: boolean;
    navLinks: NavLink[];
    companyName: string;
    companyPhone: string;
    companyEmail: string;
    companyAddress: string;
    logoUrl: string;
    pathname: string;
    onClose: () => void;
  }) => {
    const [openGroup, setOpenGroup] = useState<string | null>(null);

    useEffect(() => {
      if (!mobileOpen) {
        setOpenGroup(null);
      }
    }, [mobileOpen]);

    const isPathActive = useCallback(
      (path: string): boolean => {
        if (path === "/") return pathname === "/";
        return pathname === path || pathname.startsWith(`${path}/`);
      },
      [pathname]
    );

    return (
      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              onClick={onClose}
              aria-label="Cerrar menú"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-199 bg-slate-950/55 backdrop-blur-[3px] lg:hidden"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="fixed right-0 top-0 z-200 h-dvh w-full max-w-105 border-l border-white/10 bg-white shadow-2xl lg:hidden"
            >
              <div className="flex h-full flex-col">
                <div className="relative overflow-hidden border-b border-border bg-[linear-gradient(135deg,#f8fbff_0%,#eef4ff_55%,#ffffff_100%)] px-4 pb-5 pt-4 sm:px-5">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
                  <div className="absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-primary/10 blur-3xl" />

                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt={companyName || "Logo"}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <HardHat size={22} className="text-primary" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="truncate text-base font-black tracking-tight text-dark">
                          {companyName || "Tu empresa"}
                        </div>
                        <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                          Menú principal
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      className="relative z-10 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-white text-dark shadow-sm transition-all duration-200 hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                      aria-label="Cerrar menú"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="relative mt-4 rounded-[1.4rem] border border-primary/10 bg-white/80 p-4 backdrop-blur-sm">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                      <Sparkles size={12} />
                      Navegación rápida
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Accede a servicios, proyectos y contacto desde un panel más limpio y cómodo en móvil.
                    </p>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">
                  <div className="space-y-3">
                    {navLinks.map((link) => {
                      const active = isPathActive(link.path);

                      return (
                        <MobileDrawerItem
                          key={link.path}
                          label={link.label}
                          path={link.path}
                          icon={link.icon}
                          items={link.dropdown}
                          active={active}
                          open={openGroup === link.label}
                          onToggle={() =>
                            setOpenGroup((prev) =>
                              prev === link.label ? null : link.label
                            )
                          }
                          onNavigate={onClose}
                        />
                      );
                    })}
                  </div>

                  <div className="mt-5 rounded-[1.7rem] border border-border bg-surface p-4 shadow-sm">
                    <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      Información de contacto
                    </div>

                    <div className="space-y-3">
                      {companyPhone ? (
                        <a
                          href={`tel:${cleanPhoneHref(companyPhone)}`}
                          className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:border-primary/20 hover:bg-primary/5"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                            <Phone size={17} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                              Teléfono
                            </p>
                            <p className="truncate text-sm font-semibold text-dark">
                              {companyPhone}
                            </p>
                          </div>
                        </a>
                      ) : null}

                      {companyEmail ? (
                        <a
                          href={`mailto:${companyEmail}`}
                          className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:border-primary/20 hover:bg-primary/5"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                            <Mail size={17} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                              Correo
                            </p>
                            <p className="truncate text-sm font-semibold text-dark">
                              {companyEmail}
                            </p>
                          </div>
                        </a>
                      ) : null}

                      {companyAddress ? (
                        <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                            <MapPin size={17} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                              Dirección
                            </p>
                            <p className="line-clamp-2 text-sm font-semibold text-dark">
                              {companyAddress}
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {companyPhone ? (
                      <div className="mt-4">
                        <CustomButton
                          text="Llamar ahora"
                          href={`tel:${cleanPhoneHref(companyPhone)}`}
                          component="a"
                          icon={<Phone size={17} />}
                          variant="primary"
                          size="lg"
                          className="w-full! justify-center!"
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    );
  }
);

MobileMenu.displayName = "MobileMenu";

const Navbar: FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);

  const location = useLocation();
  const pathname = location.pathname;

  const { services, projects, company, siteConfig } = useAppState();

  const lastScrollState = useRef(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const updateScrollState = (): void => {
      const nextScrolled = window.scrollY > 24;

      if (lastScrollState.current !== nextScrolled) {
        lastScrollState.current = nextScrolled;
        setScrolled(nextScrolled);
      }

      rafId.current = null;
    };

    const onScroll = (): void => {
      if (rafId.current !== null) return;
      rafId.current = window.requestAnimationFrame(updateScrollState);
    };

    updateScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, [mobileOpen]);

  const companyName = cleanText(company?.nombre);
  const companyPhone =
    cleanText(siteConfig?.contact_phone) || cleanText(company?.telefono);
  const companyEmail =
    cleanText(siteConfig?.contact_email) || cleanText(company?.email);
  const companyAddress =
    cleanText(siteConfig?.contact_address) || cleanText(company?.direccion);

  const logoUrl = useMemo(() => getCompanyLogoUrl(company), [company]);
  const scheduleText = useMemo(() => getScheduleText(siteConfig), [siteConfig]);

  const activeServices = useMemo<DropdownItem[]>(() => {
    return safeArray<Service>(services)
      .filter((service) => service?.activo !== false)
      .map((service) => {
        const label = cleanText(service?.titulo);
        const slug = cleanText((service as Service & { slug?: string }).slug);
        const id = cleanText(service?.id);

        return {
          label,
          path: slug
            ? `/servicios/${slug}`
            : id
              ? `/servicios/${id}`
              : "/servicios",
        };
      })
      .filter((item) => item.label.length > 0)
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [services]);

  const activeProjects = useMemo<DropdownItem[]>(() => {
    return safeArray<Project>(projects)
      .filter((project) => project?.activo !== false)
      .map((project) => {
        const label = cleanText(project?.titulo);
        const slug =
          cleanText((project as Project & { slug?: string }).slug) ||
          makeSlug(cleanText(project?.titulo));
        const id = cleanText(project?.id);

        return {
          label,
          path: slug
            ? `/proyectos/${slug}`
            : id
              ? `/proyectos/${id}`
              : "/proyectos",
        };
      })
      .filter((item) => item.label.length > 0)
      .sort((a, b) => a.label.localeCompare(b.label))
      .slice(0, 10);
  }, [projects]);

  const navLinks = useMemo<NavLink[]>(() => {
    return [
      {
        label: "Inicio",
        path: "/",
        icon: iconMap.Inicio,
      },
      {
        label: "Nosotros",
        path: "/nosotros",
        icon: iconMap.Nosotros,
      },
      {
        label: "Servicios",
        path: "/servicios",
        icon: iconMap.Servicios,
        dropdown: activeServices,
      },
      {
        label: "Proyectos",
        path: "/proyectos",
        icon: iconMap.Proyectos,
        dropdown: activeProjects,
      },
      {
        label: "Contacto",
        path: "/contacto",
        icon: iconMap.Contacto,
      },
    ];
  }, [activeServices, activeProjects]);

  const openMobileMenu = useCallback(() => {
    setMobileOpen(true);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
  }, []);


  const openDropdown = useCallback((label: string) => {
    setDropdown(label);
  }, []);

  const closeDropdown = useCallback(() => {
    setDropdown(null);
  }, []);

  return (
    <>
      <NavbarTopBar
        scheduleText={scheduleText}
        companyAddress={companyAddress}
        companyPhone={companyPhone}
      />

      <header
        className={`sticky top-0 z-150 border-b border-border/80 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          scrolled
            ? "bg-white/88 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl"
            : "bg-white/96 shadow-sm"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-3 sm:h-20 sm:gap-4">
            <NavbarBrand
              logoUrl={logoUrl}
              companyName={companyName}
              companyPhone={companyPhone}
            />

            <DesktopNav
              navLinks={navLinks}
              dropdown={dropdown}
              onOpenDropdown={openDropdown}
              onCloseDropdown={closeDropdown}
              pathname={pathname}
            />

            <div className="flex items-center gap-2 sm:gap-3">
              {companyPhone ? (
                <div className="hidden md:block">
                  <CustomButton
                    text="Llámanos"
                    href={`tel:${cleanPhoneHref(companyPhone)}`}
                    component="a"
                    icon={<Phone size={17} />}
                    variant="primary"
                    size="md"
                    className="px-4!"
                  />
                </div>
              ) : null}

              <button
                type="button"
                onClick={mobileOpen ? closeMobileMenu : openMobileMenu}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border shadow-sm transition-all duration-200 lg:hidden ${
                  mobileOpen
                    ? "border-primary/20 bg-primary/5 text-primary"
                    : "border-border bg-surface text-dark hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                }`}
                aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-navigation"
              >
                {mobileOpen ? <X size={21} /> : <Menu size={21} />}
              </button>
            </div>
          </div>
        </div>

        <div id="mobile-navigation">
          <MobileMenu
            mobileOpen={mobileOpen}
            navLinks={navLinks}
            companyName={companyName}
            companyPhone={companyPhone}
            companyEmail={companyEmail}
            companyAddress={companyAddress}
            logoUrl={logoUrl}
            pathname={pathname}
            onClose={closeMobileMenu}
          />
        </div>
      </header>
    </>
  );
};

export default Navbar;