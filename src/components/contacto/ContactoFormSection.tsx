import {
  useMemo,
  useState,
  type ChangeEvent,
  type FC,
  type FormEvent,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  Mail,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";

import { useAppState } from "@/hooks/useAppState";
import { useContacts } from "@/hooks/useContacts";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";

import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";

type ContactFormState = {
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  servicio_id: string;
  mensaje: string;
};

const initialForm: ContactFormState = {
  nombre: "",
  email: "",
  telefono: "",
  empresa: "",
  servicio_id: "",
  mensaje: "",
};

const safeText = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value).trim();
  return "";
};

const normalizePhone = (value?: string | null): string =>
  (value ?? "").replace(/[^\d+]/g, "");

const isEmailValid = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const ContactInfoCard: FC<{
  icon: ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => {
  if (!value) return null;

  return (
    <div className="rounded-[1.6rem] border border-border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
          {icon}
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-sm font-bold text-dark md:text-base">{value}</p>
        </div>
      </div>
    </div>
  );
};

const ContactoFormSection: FC = () => {
  const { company, siteConfig, services } = useAppState();
  const { createContact, loading } = useContacts();
  const { showMessage } = useNotification();

  const [form, setForm] = useState<ContactFormState>(initialForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormState, string>>
  >({});

  const activeServices = useMemo(() => {
    return (Array.isArray(services) ? services : [])
      .filter((item) => item?.activo !== false)
      .sort((a, b) => {
        const orderA = typeof a?.orden === "number" ? a.orden : 9999;
        const orderB = typeof b?.orden === "number" ? b.orden : 9999;

        if (orderA !== orderB) return orderA - orderB;
        return safeText(a?.titulo).localeCompare(safeText(b?.titulo));
      });
  }, [services]);

  const serviceOptions = useMemo(() => {
    return activeServices.map((service) => ({
      value: String(service.id),
      label: safeText(service.titulo),
    }));
  }, [activeServices]);

  const contactInfo = useMemo(() => {
    const companyName =
      safeText(company?.nombre) ||
      safeText(siteConfig?.site_name) ||
      "Nuestra empresa";

    const phone =
      safeText(siteConfig?.contact_phone) || safeText(company?.telefono);

    const email =
      safeText(siteConfig?.contact_email) || safeText(company?.email);

    const description =
      safeText(siteConfig?.site_description) ||
      "Déjanos tus datos y tu mensaje. Nuestro equipo revisará tu solicitud y te responderá lo antes posible.";

    return {
      companyName,
      phone,
      email,
      description,
    };
  }, [company, siteConfig]);

  const handleChange = (field: keyof ContactFormState, value: string): void => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof ContactFormState, string>> = {};

    if (!form.nombre.trim()) {
      nextErrors.nombre = "Ingresa tu nombre.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Ingresa tu correo.";
    } else if (!isEmailValid(form.email)) {
      nextErrors.email = "Ingresa un correo válido.";
    }

    if (!form.mensaje.trim()) {
      nextErrors.mensaje = "Escribe tu mensaje.";
    } else if (form.mensaje.trim().length < 10) {
      nextErrors.mensaje = "El mensaje debe tener al menos 10 caracteres.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!validate()) return;

    void createContact(
      {
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim() || null,
        empresa: form.empresa.trim() || null,
        servicio_id: form.servicio_id || null,
        mensaje: form.mensaje.trim(),
      },
      ({ success, message }) => {
        showMessage(
          message ||
            (success
              ? "Tu mensaje fue enviado correctamente."
              : "No se pudo enviar el mensaje."),
          success ? "success" : "error"
        );

        if (success) {
          setForm(initialForm);
          setErrors({});
        }
      }
    );
  };

  const phoneHref = normalizePhone(contactInfo.phone);

  return (
    <section className="relative overflow-hidden bg-surface py-20 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_36%)]" />
      <div className="absolute -left-16 top-12 h-52 w-52 rounded-full bg-primary/8 blur-3xl" />
      <div className="absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-primary/8 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            className="rounded-4xl border border-border bg-white p-6 shadow-sm md:p-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <Sparkles size={14} />
              Estamos listos para ayudarte
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-dark md:text-4xl">
              Cuéntanos qué necesitas
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              {contactInfo.description}
            </p>

            <div className="mt-8 grid gap-4">
              <ContactInfoCard
                icon={<Building2 size={18} />}
                label="Empresa"
                value={contactInfo.companyName}
              />

              <ContactInfoCard
                icon={<Phone size={18} />}
                label="Teléfono"
                value={contactInfo.phone}
              />

              <ContactInfoCard
                icon={<Mail size={18} />}
                label="Correo"
                value={contactInfo.email}
              />

              <ContactInfoCard
                icon={<Wrench size={18} />}
                label="Servicios"
                value={`${activeServices.length} disponibles`}
              />
            </div>

            <div className="mt-8 rounded-[1.6rem] border border-primary/10 bg-primary/5 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <h3 className="text-base font-black tracking-tight text-dark">
                    Atención profesional
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Envíanos tu consulta y te responderemos con una orientación
                    clara, rápida y enfocada en tu necesidad.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="rounded-4xl border border-border bg-white p-6 shadow-sm md:p-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <MessageSquare size={14} />
              Formulario de contacto
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <CustomInput
                name="nombre"
                label="Nombre completo"
                value={form.nombre}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange("nombre", e.target.value)
                }
                fullWidth
                required
                error={Boolean(errors.nombre)}
                helperText={errors.nombre ?? ""}
                icon={<CheckCircle2 fontSize="small" />}
              />

              <CustomInput
                name="email"
                label="Correo electrónico"
                type="email"
                value={form.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange("email", e.target.value)
                }
                fullWidth
                required
                error={Boolean(errors.email)}
                helperText={errors.email ?? ""}
                icon={<Mail fontSize="small" />}
              />

              <div className="grid gap-5 md:grid-cols-2">
                <CustomInput
                  name="telefono"
                  label="Teléfono"
                  value={form.telefono}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange("telefono", e.target.value)
                  }
                  fullWidth
                  icon={<Phone fontSize="small" />}
                />

                <CustomInput
                  name="empresa"
                  label="Empresa"
                  value={form.empresa}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange("empresa", e.target.value)
                  }
                  fullWidth
                  icon={<Building2 fontSize="small" />}
                />
              </div>

              <CustomSelected
                value={form.servicio_id}
                onChange={(event) =>
                  handleChange("servicio_id", String(event.target.value ?? ""))
                }
                options={serviceOptions}
                label="Servicio de interés"
                placeholder="Selecciona un servicio"
                fullWidth
                variant="primary"
                size="lg"
              />

              <CustomInput
                name="mensaje"
                label="Mensaje"
                value={form.mensaje}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange("mensaje", e.target.value)
                }
                fullWidth
                multiline
                rows={6}
                required
                error={Boolean(errors.mensaje)}
                helperText={errors.mensaje ?? ""}
                icon={<MessageSquare fontSize="small" />}
              />

              <div className="flex flex-wrap gap-4 pt-2">
                <CustomButton
                  type="submit"
                  text="Enviar mensaje"
                  icon={<Send size={17} />}
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="gap-1! px-4!"
                />

                {phoneHref ? (
                  <CustomButton
                    text="Llamar ahora"
                    component="a"
                    href={`tel:${phoneHref}`}
                    icon={<Phone size={17} />}
                    variant="secondary"
                    size="lg"
                    className="gap-1! px-4!"
                  />
                ) : null}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactoFormSection;