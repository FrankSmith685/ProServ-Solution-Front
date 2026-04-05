/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Footer - dinámico desde API
 */
import { useMemo, type FC } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  HardHat,
  ArrowRight,
} from "lucide-react";

import type { JSX } from "react";
import type { LucideIcon } from "lucide-react";

import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomChip } from "@/components/ui/kit/CustomChip";

import type { Service } from "@/interfaces/hook/IUseServices";
import { useAppState } from "@/hooks/useAppState";

/* ================= TYPES ================= */
type SocialLink = {
  icon: LucideIcon;
  href: string;
  label: string;
};

type NavItem = {
  label: string;
  path: string;
};

type FooterLinkItem = {
  label: string;
  path: string;
};

/* ================= HELPERS ================= */
const cleanText = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value).trim();
  return "";
};

const safeArray = <T,>(value: T[] | null | undefined): T[] => {
  return Array.isArray(value) ? value : [];
};

const cleanPhoneHref = (value: string): string => {
  return value.replace(/[^\d+]/g, "");
};

const normalizeUrl = (value: string): string => {
  const url = cleanText(value);
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
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

const getFirstAvailableText = (
  source: Record<string, unknown>,
  keys: string[]
): string => {
  for (const key of keys) {
    const value = cleanText(source[key]);
    if (value) return value;
  }
  return "";
};

/* ================= STATIC FALLBACK ================= */
const navItems: NavItem[] = [
  { label: "Inicio", path: "/" },
  { label: "Nosotros", path: "/nosotros" },
  { label: "Proyectos", path: "/proyectos" },
  { label: "Contacto", path: "/contacto" },
];

/* ================= SMALL UI ================= */
const FooterSectionTitle: FC<{ title: string }> = ({ title }) => {
  return (
    <h4 className="text-sm font-black uppercase tracking-[0.18em] text-white">
      {title}
    </h4>
  );
};

const FooterTextLink: FC<FooterLinkItem> = ({ label, path }) => {
  return (
    <Link
      to={path}
      className="group inline-flex max-w-full items-center gap-2 text-sm text-white/65 transition-all duration-200 hover:text-primary"
    >
      <span className="truncate">{label}</span>
      <ArrowRight
        size={14}
        className="shrink-0 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
      />
    </Link>
  );
};

const FooterExternalLink: FC<{
  label: string;
  href: string;
}> = ({ label, href }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex max-w-full items-center gap-2 text-sm text-white/65 transition-all duration-200 hover:text-primary"
    >
      <span className="truncate">{label}</span>
      <ArrowRight
        size={14}
        className="shrink-0 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
      />
    </a>
  );
};

const SocialButton: FC<{
  icon: LucideIcon;
  href: string;
  label: string;
}> = ({ icon: Icon, href, label }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-primary hover:text-white hover:shadow-[0_16px_40px_rgba(37,99,235,0.28)]"
    >
      <Icon
        size={17}
        className="transition-transform duration-300 group-hover:scale-110"
      />
    </a>
  );
};

const ContactItem: FC<{
  icon: React.ReactNode;
  children: React.ReactNode;
  href?: string;
}> = ({ icon, children, href }) => {
  const content = (
    <div className="group flex items-start gap-3 rounded-2xl border border-white/8 bg-white/3 px-4 py-3 transition-all duration-200 hover:border-primary/15 hover:bg-white/5">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
        {icon}
      </div>
      <div className="min-w-0 wrap-break-word text-sm leading-relaxed text-white/72">
        {children}
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block transition-colors duration-200 hover:text-primary"
      >
        {content}
      </a>
    );
  }

  return content;
};

const EmptyInfoCard: FC<{
  title: string;
  text: string;
}> = ({ title, text }) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="text-sm font-bold text-white">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-white/50">{text}</p>
    </div>
  );
};

/* ================= COMPONENT ================= */
export default function Footer(): JSX.Element {
  const { services, company, siteConfig } = useAppState();

  const companyName = cleanText(company?.nombre);
  const companyPhone = cleanText(company?.telefono);
  const companyPhoneSecondary = cleanText(
    (company as Record<string, unknown> | null)?.telefono_secundario
  );
  const companyEmail = cleanText(company?.email);
  const companyAddress = cleanText(company?.direccion);

  const logoUrl = useMemo(() => getCompanyLogoUrl(company), [company]);

  const siteConfigSource = (siteConfig ?? {}) as Record<string, unknown>;

  const companyDescription = useMemo(() => {
    return (
      getFirstAvailableText(siteConfigSource, [
        "footer_descripcion",
        "footer_description",
        "descripcion_footer",
        "meta_descripcion",
        "site_description",
      ]) ||
      "Empresa de servicios generales comprometida con la calidad, la atención profesional y la excelencia en cada proyecto."
    );
  }, [siteConfigSource]);

  const footerOpinionPath = useMemo(() => {
    return (
      getFirstAvailableText(siteConfigSource, [
        "footer_testimonial_url",
        "footer_opinion_url",
        "testimonial_url",
      ]) || "/dejar-testimonio"
    );
  }, [siteConfigSource]);

  const designedText = useMemo(() => {
    return (
      getFirstAvailableText(siteConfigSource, [
        "footer_creditos",
        "footer_designed_text",
        "footer_signature",
      ]) || "Diseñado con dedicación en Lima, Perú"
    );
  }, [siteConfigSource]);

  const socialLinks = useMemo<SocialLink[]>(() => {
    const facebook = normalizeUrl(
      getFirstAvailableText(siteConfigSource, [
        "facebook",
        "facebook_url",
        "red_facebook",
      ])
    );

    const instagram = normalizeUrl(
      getFirstAvailableText(siteConfigSource, [
        "instagram",
        "instagram_url",
        "red_instagram",
      ])
    );

    const twitter = normalizeUrl(
      getFirstAvailableText(siteConfigSource, [
        "twitter",
        "twitter_url",
        "x",
        "x_url",
        "red_twitter",
      ])
    );

    return [
      { icon: Facebook, href: facebook, label: "Facebook" },
      { icon: Instagram, href: instagram, label: "Instagram" },
      { icon: Twitter, href: twitter, label: "Twitter / X" },
    ].filter((item) => item.href);
  }, [siteConfigSource]);

  const activeServices = useMemo<Service[]>(() => {
    return safeArray<Service>(services)
      .filter((service) => service?.activo !== false)
      .sort((a, b) => {
        const orderA =
          typeof a?.orden === "number" && Number.isFinite(a.orden)
            ? a.orden
            : Number.MAX_SAFE_INTEGER;

        const orderB =
          typeof b?.orden === "number" && Number.isFinite(b.orden)
            ? b.orden
            : Number.MAX_SAFE_INTEGER;

        if (orderA !== orderB) return orderA - orderB;
        return cleanText(a?.titulo).localeCompare(cleanText(b?.titulo));
      })
      .slice(0, 6);
  }, [services]);

  const serviceLinks = useMemo<FooterLinkItem[]>(() => {
    return activeServices.map((service) => {
      const title = cleanText(service?.titulo);
      const slug = cleanText((service as Service & { slug?: string }).slug);
      const id = cleanText(service?.id);

      return {
        label: title,
        path: slug
          ? `/servicios/${slug}`
          : id
            ? `/servicios/${id}`
            : "/servicios",
      };
    });
  }, [activeServices]);

  const currentYear = new Date().getFullYear();

  const showBrandBlock =
    Boolean(companyName) || Boolean(companyDescription) || Boolean(logoUrl);

  const showContactBlock =
    Boolean(companyAddress) ||
    Boolean(companyPhone) ||
    Boolean(companyPhoneSecondary) ||
    Boolean(companyEmail);

  return (
    <footer className="relative overflow-hidden bg-dark text-on-dark">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.14),transparent_35%)]" />
      <div className="absolute left-0 top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[36px_36px] opacity-[0.06]" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,1fr)] xl:gap-10">
          {/* Brand */}
          <div className="min-w-0 xl:pr-4">
            {showBrandBlock ? (
              <div className="flex h-full flex-col">
                <Link
                  to="/"
                  className="group inline-flex max-w-full items-center gap-4"
                >
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_16px_40px_rgba(0,0,0,0.20)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.18),transparent_55%)]" />

                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={companyName || "Logo"}
                        className="relative h-full w-full object-cover"
                      />
                    ) : (
                      <HardHat size={24} className="relative text-primary" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-base font-black leading-none tracking-tight text-white sm:text-lg">
                      {companyName || "Mi Empresa"}
                    </div>

                    <div className="mt-2 max-w-max">
                      <div className="rounded-full border border-primary/15 bg-primary/10">
                        <CustomChip
                          label="Servicios Generales"
                          clickable={false}
                          variant="secondary-outline"
                          className="border-transparent! bg-transparent! text-primary!"
                        />
                      </div>
                    </div>
                  </div>
                </Link>

                <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/65 xl:max-w-md">
                  {companyDescription}
                </p>

                {socialLinks.length > 0 ? (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {socialLinks.map(({ icon, href, label }) => (
                      <SocialButton
                        key={`${label}-${href}`}
                        icon={icon}
                        href={href}
                        label={label}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <EmptyInfoCard
                title="Información empresarial"
                text="Aún no hay datos de marca configurados para mostrar en el footer."
              />
            )}
          </div>

          {/* Servicios */}
          <div className="min-w-0">
            <FooterSectionTitle title="Servicios" />

            <div className="mt-5 space-y-3">
              {serviceLinks.length > 0 ? (
                serviceLinks.map((service) => (
                  <FooterTextLink
                    key={`${service.path}-${service.label}`}
                    label={service.label}
                    path={service.path}
                  />
                ))
              ) : (
                <p className="text-sm leading-relaxed text-white/45">
                  No hay servicios registrados.
                </p>
              )}
            </div>
          </div>

          {/* Navegación */}
          <div className="min-w-0">
            <FooterSectionTitle title="Navegación" />

            <div className="mt-5 space-y-3">
              {navItems.map(({ label, path }) => (
                <FooterTextLink key={path} label={label} path={path} />
              ))}
            </div>
          </div>

          {/* Contacto */}
          <div className="min-w-0">
            <FooterSectionTitle title="Contacto" />

            <div className="mt-5 space-y-3">
              {showContactBlock ? (
                <>
                  {companyAddress ? (
                    <ContactItem icon={<MapPin size={16} />}>
                      <span className="wrap-break-word">{companyAddress}</span>
                    </ContactItem>
                  ) : null}

                  {companyPhone ? (
                    <ContactItem
                      icon={<Phone size={16} />}
                      href={`tel:${cleanPhoneHref(companyPhone)}`}
                    >
                      <span className="wrap-break-word">{companyPhone}</span>
                    </ContactItem>
                  ) : null}

                  {companyPhoneSecondary ? (
                    <ContactItem
                      icon={<Phone size={16} />}
                      href={`tel:${cleanPhoneHref(companyPhoneSecondary)}`}
                    >
                      <span className="wrap-break-word">
                        {companyPhoneSecondary}
                      </span>
                    </ContactItem>
                  ) : null}

                  {companyEmail ? (
                    <ContactItem
                      icon={<Mail size={16} />}
                      href={`mailto:${companyEmail}`}
                    >
                      <span className="break-all">{companyEmail}</span>
                    </ContactItem>
                  ) : null}
                </>
              ) : (
                <p className="text-sm leading-relaxed text-white/45">
                  No hay datos de contacto configurados.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-4xl border border-white/10 bg-white/4 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.16)] backdrop-blur-md sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-base font-black tracking-tight text-white sm:text-lg">
                ¿Quieres compartir tu experiencia con nosotros?
              </p>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-white/62">
                Tu opinión nos ayuda a fortalecer confianza y credibilidad.
              </p>
            </div>

            <div className="w-full shrink-0 lg:w-auto">
              <CustomButton
                text="Dejar mi opinión"
                component={Link}
                to={footerOpinionPath}
                icon={<ArrowRight size={17} />}
                variant="primary"
                size="lg"
                className="w-full justify-center px-5! gap-2! sm:w-auto"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-center sm:px-6 md:flex-row md:items-center md:justify-between md:text-left">
          <p className="text-xs leading-relaxed text-white/42">
            © {currentYear} {companyName || "Mi Empresa"}. Todos los derechos
            reservados.
          </p>

          <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4 md:justify-end md:text-left">
            {footerOpinionPath.startsWith("http") ? (
              <FooterExternalLink
                label="Dejar mi opinión"
                href={footerOpinionPath}
              />
            ) : (
              <Link
                to={footerOpinionPath}
                className="text-xs text-white/42 transition-colors duration-200 hover:text-primary"
              >
                Dejar mi opinión
              </Link>
            )}

            <span className="hidden text-white/18 sm:inline">•</span>

            <p className="text-xs leading-relaxed text-white/42">
              {designedText}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}