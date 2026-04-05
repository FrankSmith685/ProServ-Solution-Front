
import { useMemo, type FC } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MessageCircle,
  Phone,
  Sparkles,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useSiteConfig } from "@/hooks/useConfigSite";
import { useAppState } from "@/hooks/useAppState";

import type { HomeCtaPhoneItem } from "@/interfaces/page/home/IHomeSections";

const normalizePhone = (value?: string | null): string =>
  (value ?? "").replace(/[^\d+]/g, "");

const isValidPhone = (value?: string | null): boolean =>
  normalizePhone(value).length >= 7;

const extractWhatsAppPhone = (value?: string | null): string => {
  if (!value) return "";

  const trimmed = value.trim();
  if (!trimmed) return "";

  if (!trimmed.includes("http")) {
    return normalizePhone(trimmed);
  }

  try {
    const url = new URL(trimmed);

    const phoneFromQuery = url.searchParams.get("phone");
    if (phoneFromQuery) {
      return normalizePhone(phoneFromQuery);
    }

    const pathname = url.pathname.replace(/^\/+/, "");
    if (pathname) {
      return normalizePhone(pathname);
    }

    return "";
  } catch {
    return normalizePhone(trimmed);
  }
};

const getWhatsAppHref = (value?: string | null): string => {
  const trimmed = value?.trim() ?? "";
  const extractedPhone = extractWhatsAppPhone(trimmed);

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (!isValidPhone(extractedPhone)) {
    return "";
  }

  return `https://wa.me/${normalizePhone(extractedPhone)}`;
};

const CTASectionSkeleton: FC = () => {
  return (
    <section className="relative overflow-hidden bg-surface py-20 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.10),transparent_38%)]" />
      <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-4xl border border-border bg-primary p-8 shadow-[0_24px_80px_rgba(0,0,0,0.12)] md:p-10 lg:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <div className="h-8 w-40 animate-pulse rounded-full bg-white/15" />
              <div className="mt-5 h-12 w-11/12 animate-pulse rounded-2xl bg-white/15" />
              <div className="mt-3 h-12 w-8/12 animate-pulse rounded-2xl bg-white/15" />
              <div className="mt-5 h-5 w-7/12 animate-pulse rounded-full bg-white/10" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-16 w-full min-w-60 animate-pulse rounded-2xl bg-white/15" />
              <div className="h-16 w-full min-w-60 animate-pulse rounded-2xl bg-white/15" />
              <div className="h-16 w-full min-w-60 animate-pulse rounded-2xl bg-white/10 sm:col-span-2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactChip: FC<{
  icon: React.ReactNode;
  text: string;
}> = ({ icon, text }) => {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white/88 backdrop-blur-md">
      {icon}
      {text}
    </div>
  );
};

const ContactActionCard: FC<{
  href: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  variant?: "primary" | "secondary" | "dark";
  external?: boolean;
}> = ({
  href,
  label,
  value,
  icon,
  variant = "primary",
  external = false,
}) => {
  const styles =
    variant === "primary"
      ? "border-white/16 bg-white text-dark hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(255,255,255,0.22)]"
      : variant === "dark"
        ? "border-white/12 bg-dark text-white hover:-translate-y-1 hover:bg-dark/90 hover:shadow-[0_18px_45px_rgba(0,0,0,0.22)]"
        : "border-white/18 bg-white/12 text-white hover:-translate-y-1 hover:bg-white/18 hover:shadow-[0_18px_45px_rgba(0,0,0,0.16)]";

  const content = (
    <div
      className={`group flex min-h-21 items-center gap-4 rounded-[1.4rem] border px-5 py-4 shadow-lg backdrop-blur-md transition-all duration-300 ${styles}`}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
          variant === "primary"
            ? "bg-primary text-white shadow-lg shadow-primary/20"
            : variant === "dark"
              ? "bg-white/10 text-white"
              : "bg-white/12 text-white"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p
          className={`text-[11px] font-bold uppercase tracking-[0.18em] ${
            variant === "primary" ? "text-dark/55" : "text-white/68"
          }`}
        >
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-black sm:text-base">{value}</p>
      </div>
    </div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="block">
        {content}
      </a>
    );
  }

  return (
    <a href={href} className="block">
      {content}
    </a>
  );
};

const CTASection: FC = () => {
  const { siteConfig } = useAppState();
  const { loading } = useSiteConfig();

  const phones = useMemo<HomeCtaPhoneItem[]>(() => {
    const items: HomeCtaPhoneItem[] = [];

    const contactPhone = siteConfig.contact_phone?.trim() ?? "";
    const whatsappPhone = extractWhatsAppPhone(siteConfig.whatsapp_url);

    if (isValidPhone(contactPhone)) {
      items.push({
        number: contactPhone,
        href: `tel:${normalizePhone(contactPhone)}`,
        variant: "primary",
      });
    }

    if (
      isValidPhone(whatsappPhone) &&
      normalizePhone(whatsappPhone) !== normalizePhone(contactPhone)
    ) {
      items.push({
        number: whatsappPhone,
        href: `tel:${normalizePhone(whatsappPhone)}`,
        variant: "secondary",
      });
    }

    return items;
  }, [siteConfig]);

  const contactEmail = siteConfig.contact_email?.trim() ?? "";
  const whatsappHref = getWhatsAppHref(siteConfig.whatsapp_url);
  const hasWhatsapp = Boolean(whatsappHref);
  const hasContent =
    phones.length > 0 || Boolean(contactEmail) || Boolean(hasWhatsapp);

  if (loading && !hasContent) {
    return <CTASectionSkeleton />;
  }

  if (!hasContent) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-surface py-20 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.10),transparent_35%)]" />
      <div className="absolute left-0 top-10 h-56 w-56 rounded-full bg-primary/8 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-4xl border border-white/10 bg-primary px-6 py-10 text-white shadow-[0_24px_80px_rgba(0,0,0,0.14)] sm:px-8 lg:px-12 lg:py-12"
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_34%,rgba(255,255,255,0.08)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_28%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] bg-size-[34px_34px] opacity-[0.07]" />
          <div className="absolute -left-20 top-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(340px,520px)]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white backdrop-blur-md">
                <Sparkles size={14} className="text-white" />
                Hablemos de tu proyecto
              </div>

              <h2 className="mt-5 max-w-3xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                ¿Listo para cotizar o recibir atención inmediata?
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/82 md:text-base">
                Ponte en contacto con nosotros por llamada, correo o WhatsApp.
                Te ayudamos con una respuesta más rápida, clara y profesional.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <ContactChip
                  icon={<ShieldCheck size={14} className="text-white" />}
                  text="Respuesta rápida"
                />
                <ContactChip
                  icon={<Phone size={14} className="text-white" />}
                  text="Atención directa"
                />
                <ContactChip
                  icon={<MessageCircle size={14} className="text-white" />}
                  text="Soporte personalizado"
                />
              </div>

              {contactEmail ? (
                <div className="mt-7 inline-flex items-center gap-3 rounded-[1.25rem] border border-white/12 bg-white/10 px-4 py-3 text-sm font-semibold text-white/92 backdrop-blur-md">
                  <Mail size={18} className="text-white" />
                  <span className="break-all">{contactEmail}</span>
                </div>
              ) : null}
            </div>

            <div className="grid gap-4">
              {phones.map((phone) => (
                <ContactActionCard
                  key={`${phone.variant}-${phone.number}`}
                  href={phone.href}
                  label={
                    phone.variant === "primary"
                      ? "Línea principal"
                      : "Línea adicional"
                  }
                  value={phone.number}
                  icon={<Phone size={22} />}
                  variant={phone.variant === "primary" ? "primary" : "secondary"}
                />
              ))}

              {hasWhatsapp ? (
                <ContactActionCard
                  href={whatsappHref}
                  label="WhatsApp"
                  value="Escríbenos ahora"
                  icon={<MessageCircle size={22} />}
                  variant="secondary"
                  external
                />
              ) : null}

              <Link
                to="/contacto"
                className="block"
              >
                <div className="group flex min-h-21 items-center gap-4 rounded-[1.4rem] border border-white/12 bg-dark px-5 py-4 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-dark/90 hover:shadow-[0_18px_45px_rgba(0,0,0,0.24)]">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
                    <MessageCircle size={22} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/68">
                      Formulario
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-sm font-black sm:text-base">
                      Enviar mensaje
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;