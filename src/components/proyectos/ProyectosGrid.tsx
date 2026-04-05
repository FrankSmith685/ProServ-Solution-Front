import {
  useMemo,
  type FC,
} from "react";
import { motion } from "framer-motion";
import { ArrowRight, FolderKanban } from "lucide-react";
import { Link } from "react-router-dom";

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

type ProjectServiceRef = {
  titulo?: string | null;
};

type ProjectViewSource = {
  id?: string | number | null;
  slug?: string | null;
  titulo?: string | null;
  descripcion?: string | null;
  descripcion_larga?: string | null;
  cliente?: string | null;
  activo?: boolean | null;
  orden?: number | string | null;
  imagen_url?: string | null;
  images?: ProjectImageRef[] | null;
  categoria?: ProjectCategoryRef | null;
  category?: ProjectCategoryRef | null;
  servicio?: ProjectServiceRef | null;
  service?: ProjectServiceRef | null;
};

type ProjectCardItem = {
  id: string;
  slug: string;
  path: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  servicio: string;
  cliente: string;
  imagenUrl: string;
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
  const direct = buildAbsoluteUrl(safeText(project.imagen_url));
  if (direct) return direct;

  const firstImage = Array.isArray(project.images) ? project.images[0] : null;

  const mediaUrl = buildAbsoluteUrl(safeText(firstImage?.media?.url));
  if (mediaUrl) return mediaUrl;

  const imageUrl = buildAbsoluteUrl(safeText(firstImage?.url));
  if (imageUrl) return imageUrl;

  const legacyImageUrl = buildAbsoluteUrl(safeText(firstImage?.imagen_url));
  if (legacyImageUrl) return legacyImageUrl;

  return "";
};

const makeProjectPath = (project: { id: string; slug: string }): string => {
  if (project.slug) return `/proyectos/${project.slug}`;
  if (project.id) return `/proyectos/${project.id}`;
  return "/proyectos";
};

const mapProjectToCardItem = (project: ProjectViewSource): ProjectCardItem | null => {
  const id = safeText(project.id);
  const titulo = safeText(project.titulo);

  if (!id || !titulo) return null;

  const slug = safeText(project.slug) || makeSlug(titulo);

  return {
    id,
    slug,
    path: makeProjectPath({ id, slug }),
    titulo,
    descripcion: safeText(project.descripcion),
    categoria:
      safeText(project.categoria?.nombre) ||
      safeText(project.category?.nombre) ||
      "Proyecto",
    servicio:
      safeText(project.servicio?.titulo) ||
      safeText(project.service?.titulo) ||
      "Servicio especializado",
    cliente: safeText(project.cliente),
    imagenUrl: getProjectImage(project),
    orden: safeNumber(project.orden, 9999),
  };
};

const EmptyState: FC = () => {
  return (
    <div className="relative overflow-hidden rounded-4xl border border-border bg-surface px-6 py-14 text-center shadow-sm md:px-10 md:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.1),transparent_42%)]" />

      <div className="relative">
        <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-[1.4rem] bg-primary shadow-lg shadow-primary/25 ring-8 ring-primary/10">
          <FolderKanban size={30} className="text-white" />
        </div>

        <h3 className="mt-6 text-2xl font-black tracking-tight text-dark md:text-3xl">
          Aún no hay proyectos publicados
        </h3>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Esta sección se llenará automáticamente cuando existan proyectos
          activos y válidos.
        </p>
      </div>
    </div>
  );
};

const ProjectCard: FC<{
  project: ProjectCardItem;
  index: number;
}> = ({ project, index }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="group overflow-hidden rounded-[1.9rem] border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {project.imagenUrl ? (
        <div className="relative h-64 overflow-hidden bg-dark">
          <img
            src={project.imagenUrl}
            alt={project.titulo}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.42),transparent_48%)]" />

          <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
            {project.categoria}
          </div>
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.10),transparent_45%)]">
          <div className="flex h-18 w-18 items-center justify-center rounded-[1.4rem] bg-primary text-white shadow-lg shadow-primary/20">
            <FolderKanban size={30} />
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-primary/8 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
            {project.servicio}
          </span>

          {project.cliente ? (
            <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              {project.cliente}
            </span>
          ) : null}
        </div>

        <h3 className="mt-4 line-clamp-2 text-xl font-black tracking-tight text-dark">
          {project.titulo}
        </h3>

        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {project.descripcion ||
            "Proyecto desarrollado con enfoque profesional, atención al detalle y resultados medibles."}
        </p>

        <div className="mt-6">
          <Link
            to={project.path}
            className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-opacity hover:opacity-80"
          >
            Ver detalle
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

const ProyectosGrid: FC = () => {
  const { projects } = useAppState();

  const items = useMemo<ProjectCardItem[]>(() => {
    return (Array.isArray(projects) ? projects : [])
      .filter((project) => project?.activo !== false)
      .map((project) => mapProjectToCardItem(project as ProjectViewSource))
      .filter((project): project is ProjectCardItem => project !== null)
      .sort((a, b) => {
        if (a.orden !== b.orden) return a.orden - b.orden;
        return a.titulo.localeCompare(b.titulo);
      });
  }, [projects]);

  return (
    <section className="relative overflow-hidden bg-surface py-20 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_38%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-black tracking-tight text-dark md:text-4xl">
                Proyectos destacados
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                Explora algunos trabajos realizados y descubre cómo llevamos cada
                proyecto desde la idea hasta el resultado final.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {items.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                />
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <CustomButton
                text="Ir a contacto"
                component={Link}
                to="/contacto"
                icon={<ArrowRight size={17} />}
                variant="primary"
                size="lg"
                className="px-4! gap-1!"
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ProyectosGrid;