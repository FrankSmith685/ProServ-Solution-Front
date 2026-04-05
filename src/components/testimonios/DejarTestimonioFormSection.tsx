import {
  useMemo,
  useState,
  type FC,
  type FormEvent,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  MessageSquareQuote,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react";

import { useAppState } from "@/hooks/useAppState";
import { useTestimonials } from "@/hooks/useTestimonials";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";

import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomInput } from "@/components/ui/kit/CustomInput";

type OpinionFormState = {
  nombre: string;
  cargo: string;
  empresa: string;
  comentario: string;
  puntuacion: string;
};

const initialForm: OpinionFormState = {
  nombre: "",
  cargo: "",
  empresa: "",
  comentario: "",
  puntuacion: "5",
};

const safeText = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value).trim();
  return "";
};

const InfoCard: FC<{
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
          <p className="mt-1 text-sm font-bold text-dark md:text-base">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

const RatingSelector: FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const current = Number(value) || 5;

  return (
    <div>
      <label className="mb-3 block text-sm font-bold text-dark">
        Puntuación
      </label>

      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((item) => {
          const active = item <= current;

          return (
            <button
              key={item}
              type="button"
              onClick={() => onChange(String(item))}
              className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-200 ${
                active
                  ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                  : "border-border bg-white text-muted-foreground hover:border-primary/30 hover:text-primary"
              }`}
              aria-label={`${item} estrella${item > 1 ? "s" : ""}`}
            >
              <Star size={18} className={active ? "fill-current" : ""} />
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        Seleccionaste{" "}
        <span className="font-bold text-dark">{current}</span> de 5 estrellas.
      </p>
    </div>
  );
};

const DejarTestimonioFormSection: FC = () => {
  const { company, siteConfig, testimonials } = useAppState();
  const { createPublicTestimonial, loading } = useTestimonials();
  const { showMessage } = useNotification();

  const [form, setForm] = useState<OpinionFormState>(initialForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof OpinionFormState, string>>
  >({});

  const content = useMemo(() => {
    const companyName =
      safeText(company?.nombre) ||
      safeText(siteConfig?.site_name) ||
      "Nuestra empresa";

    const description =
      "Comparte cómo fue tu experiencia con nuestro servicio. Tu testimonio puede ayudar a otros clientes a tomar una mejor decisión.";

    const totalTestimonials = Array.isArray(testimonials)
      ? testimonials.filter((item) => item?.activo !== false).length
      : 0;

    return {
      companyName,
      description,
      totalTestimonials,
    };
  }, [company, siteConfig, testimonials]);

  const handleChange = (field: keyof OpinionFormState, value: string): void => {
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
    const nextErrors: Partial<Record<keyof OpinionFormState, string>> = {};

    if (!form.nombre.trim()) {
      nextErrors.nombre = "Ingresa tu nombre.";
    }

    if (!form.comentario.trim()) {
      nextErrors.comentario = "Escribe tu opinión.";
    } else if (form.comentario.trim().length < 20) {
      nextErrors.comentario =
        "La opinión debe tener al menos 20 caracteres.";
    }

    const puntuacion = Number(form.puntuacion);
    if (!Number.isFinite(puntuacion) || puntuacion < 1 || puntuacion > 5) {
      nextErrors.puntuacion = "Selecciona una puntuación válida.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!validate()) return;

    void createPublicTestimonial(
      {
        nombre: form.nombre.trim(),
        cargo: form.cargo.trim() || null,
        empresa: form.empresa.trim() || null,
        testimonio: form.comentario.trim(),
        calificacion: Number(form.puntuacion),
        proyecto_id: null,
        activo: false,
      },
      ({ success, message }) => {
        showMessage(
          message ||
            (success
              ? "Tu opinión fue enviada correctamente."
              : "No se pudo enviar tu opinión."),
          success ? "success" : "error"
        );

        if (success) {
          setForm(initialForm);
          setErrors({});
        }
      }
    );
  };

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
              Valoramos tu experiencia
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-dark md:text-4xl">
              Déjanos tu opinión
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              {content.description}
            </p>

            <div className="mt-8 grid gap-4">
              <InfoCard
                icon={<Building2 size={18} />}
                label="Empresa"
                value={content.companyName}
              />

              <InfoCard
                icon={<MessageSquareQuote size={18} />}
                label="Testimonios"
                value={`${content.totalTestimonials} publicados`}
              />

              <InfoCard
                icon={<ShieldCheck size={18} />}
                label="Confianza"
                value="Opiniones reales y verificables"
              />
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
              <MessageSquareQuote size={14} />
              Formulario de opinión
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <CustomInput
                name="nombre"
                label="Nombre completo"
                value={form.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                fullWidth
                required
                error={Boolean(errors.nombre)}
                helperText={errors.nombre ?? ""}
                icon={<UserRound fontSize="small" />}
              />

              <div className="grid gap-5 md:grid-cols-2">
                <CustomInput
                  name="cargo"
                  label="Cargo o rol"
                  value={form.cargo}
                  onChange={(e) => handleChange("cargo", e.target.value)}
                  fullWidth
                  icon={<CheckCircle2 fontSize="small" />}
                />

                <CustomInput
                  name="empresa"
                  label="Empresa"
                  value={form.empresa}
                  onChange={(e) => handleChange("empresa", e.target.value)}
                  fullWidth
                  icon={<Building2 fontSize="small" />}
                />
              </div>

              <RatingSelector
                value={form.puntuacion}
                onChange={(value) => handleChange("puntuacion", value)}
              />

              {errors.puntuacion ? (
                <p className="text-sm text-red-500">{errors.puntuacion}</p>
              ) : null}

              <CustomInput
                name="comentario"
                label="Tu opinión"
                value={form.comentario}
                onChange={(e) => handleChange("comentario", e.target.value)}
                fullWidth
                multiline
                rows={6}
                required
                error={Boolean(errors.comentario)}
                helperText={errors.comentario ?? ""}
                icon={<MessageSquareQuote fontSize="small" />}
              />

              <div className="flex flex-wrap gap-4 pt-2">
                <CustomButton
                  type="submit"
                  text="Enviar opinión"
                  icon={<Send size={17} />}
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="gap-1! px-4!"
                />
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DejarTestimonioFormSection;