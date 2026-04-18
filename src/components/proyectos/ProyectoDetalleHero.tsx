import { useMemo, type FC } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, FolderKanban, Sparkles, UserRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { useAppState } from "@/hooks/useAppState";
import { CustomButton } from "@/components/ui/kit/CustomButton";

type ProjectMediaRef = {
  url?: string | null;
};

type ProjectImageRef = {
  media?: ProjectMediaRef | null;
  url?: string | null;
  imagen_url?: string | null;
};

type ProjectCategoryRef = {
  nombre?: string | null;
};

type ProjectViewSource = {
  id?: string | number | null;
  slug?: string | null;
  titulo?: string | null;
  descripcion?: string | null;
  descripcion_larga?: string | null;
  cliente?: string | null;
  activo?: boolean | null;
  imagen_url?: string | null;
  images?: ProjectImageRef[] | null;
  categoria?: ProjectCategoryRef | null;
  category?: ProjectCategoryRef | null;
};

const safeText = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value).trim();
  return "";
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

const getProjectImage = (project: ProjectViewSource): string => {
  const directImage = buildAbsoluteUrl(safeText(project.imagen_url));
  if (directImage) return directImage;

  const firstImage = Array.isArray(project.images) ? project.images[0] : null;

  const mediaUrl = buildAbsoluteUrl(safeText(firstImage?.media?.url));
  if (mediaUrl) return mediaUrl;

  const url = buildAbsoluteUrl(safeText(firstImage?.url));
  if (url) return url;

  const legacyUrl = buildAbsoluteUrl(safeText(firstImage?.imagen_url));
  if (legacyUrl) return legacyUrl;

  return "";
};

const matchesProject = (project: ProjectViewSource, slug: string): boolean => {
  const currentSlug = safeText(slug);
  const projectId = safeText(project.id);
  const explicitSlug = safeText(project.slug);
  const generatedSlug = makeSlug(safeText(project.titulo));

  return (
    projectId === currentSlug ||
    explicitSlug === currentSlug ||
    generatedSlug === currentSlug
  );
};

const ProyectoDetalleHero: FC = () => {
  const { slug = "" } = useParams();
  const { projects } = useAppState();

  const project = useMemo<ProjectViewSource | null>(() => {
    if (!Array.isArray(projects)) return null;

    return (
      projects.find(
        (item) =>
          item?.activo !== false &&
          matchesProject(item as ProjectViewSource, slug)
      ) ?? null
    );
  }, [projects, slug]);

  if (!project) {
    return (
      <section className="relative overflow-hidden bg-dark py-20 text-white md:py-28">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <h1 className="text-4xl font-black sm:text-5xl">
            Proyecto no encontrado
          </h1>

          <p className="mt-4 text-white/70">
            El proyecto solicitado no está disponible o ya no existe.
          </p>

          <div className="mt-8">
            <CustomButton
              text="Volver a proyectos"
              component={Link}
              to="/proyectos"
              icon={<ArrowRight size={17} />}
              variant="primary"
              size="lg"
              className="px-4! gap-1!"
            />
          </div>
        </div>
      </section>
    );
  }

  const image = getProjectImage(project);
  const title = safeText(project.titulo);
  const description =
    safeText(project.descripcion) ||
    safeText(project.descripcion_larga) ||
    "Proyecto desarrollado con planificación, ejecución profesional y resultados de alto nivel.";
  const categoryName =
    safeText(project.categoria?.nombre) || safeText(project.category?.nombre);
  const clientName = safeText(project.cliente);

  return (
    <section className="relative overflow-hidden bg-dark py-20 text-white md:py-28">
      <div className="absolute inset-0 bg-[#0b1220]" />
      <div className="absolute inset-0 bg-linear-to-r from-[#0b1220] via-[#111827] to-[#0f172a]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(37,99,235,0.18),transparent_24%)]" />
      <div className="absolute inset-0 bg-linear-to-b from-black/15 via-transparent to-black/45" />
      <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={
            image
              ? "grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(380px,540px)] lg:gap-16"
              : "mx-auto max-w-4xl text-center"
          }
        >
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/90 backdrop-blur-md">
              <Sparkles size={14} className="text-primary" />
              Proyecto destacado
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-tight sm:text-5xl lg:text-6xl">
              {title}
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/76 md:text-base">
              {description}
            </p>

            {(categoryName || clientName) ? (
              <div className={`mt-6 flex flex-wrap gap-3 ${image ? "" : "justify-center"}`}>
                {categoryName ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white/90">
                    <BadgeCheck size={14} className="text-primary" />
                    {categoryName}
                  </div>
                ) : null}
                {clientName ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white/90">
                    <UserRound size={14} className="text-primary" />
                    {clientName}
                  </div>
                ) : null}
              </div>
            ) : null}

            <div
              className={`mt-10 flex flex-wrap gap-4 ${
                image ? "" : "justify-center"
              }`}
            >
              <CustomButton
                text="Solicitar un proyecto similar"
                component={Link}
                to="/contacto"
                icon={<ArrowRight size={17} />}
                variant="primary"
                size="lg"
                className="px-4! gap-1!"
              />

              <CustomButton
                text="Volver a proyectos"
                component={Link}
                to="/proyectos"
                variant="secondary"
                size="lg"
                className="px-4! gap-1!"
              />
            </div>
          </motion.div>

          {image ? (
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-4xl border border-white/12 bg-white/6 shadow-[0_30px_90px_rgba(0,0,0,0.24)]">
                <img
                  src={image}
                  alt={title}
                  className="h-130 w-full object-cover"
                />

                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55),transparent_42%)]" />

                <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30">
                  <FolderKanban size={22} />
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default ProyectoDetalleHero;
