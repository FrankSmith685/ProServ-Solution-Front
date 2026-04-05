import { useMemo, type FC } from "react";
import { motion } from "framer-motion";
import { ArrowRight, FolderKanban } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { useAppState } from "@/hooks/useAppState";

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
  activo?: boolean | null;
  orden?: number | string | null;
  imagen_url?: string | null;
  images?: ProjectImageRef[] | null;
  categoria?: ProjectCategoryRef | null;
  category?: ProjectCategoryRef | null;
};

type ProjectCardItem = {
  id: string;
  slug: string;
  path: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  imagenUrl: string;
  orden: number;
};

const MAX_RELATED_PROJECTS = 3;

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

const mapProjectToCardItem = (
  project: ProjectViewSource
): ProjectCardItem | null => {
  const id = safeText(project.id);
  const titulo = safeText(project.titulo);

  if (!id || !titulo) return null;

  const slug = safeText(project.slug) || makeSlug(titulo);

  return {
    id,
    slug,
    path: `/proyectos/${slug || id}`,
    titulo,
    descripcion: safeText(project.descripcion),
    categoria:
      safeText(project.categoria?.nombre) ||
      safeText(project.category?.nombre) ||
      "Proyecto",
    imagenUrl: getProjectImage(project),
    orden: safeNumber(project.orden, 9999),
  };
};

const ProyectosRelacionados: FC = () => {
  const { slug = "" } = useParams();
  const { projects } = useAppState();

  const items = useMemo<ProjectCardItem[]>(() => {
    const mapped = (Array.isArray(projects) ? projects : [])
      .filter((project) => project?.activo !== false)
      .map((project) => mapProjectToCardItem(project as ProjectViewSource))
      .filter((project): project is ProjectCardItem => project !== null)
      .sort((a, b) => {
        if (a.orden !== b.orden) return a.orden - b.orden;
        return a.titulo.localeCompare(b.titulo);
      });

    return mapped
      .filter((item) => item.slug !== slug && item.id !== slug)
      .slice(0, MAX_RELATED_PROJECTS);
  }, [projects, slug]);

  if (items.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.06),transparent_38%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black tracking-tight text-dark md:text-4xl">
            Proyectos relacionados
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            Descubre otros trabajos que también reflejan nuestra experiencia y
            enfoque profesional.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="group overflow-hidden rounded-[1.9rem] border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {project.imagenUrl ? (
                <div className="relative h-60 overflow-hidden bg-dark">
                  <img
                    src={project.imagenUrl}
                    alt={project.titulo}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.40),transparent_48%)]" />
                </div>
              ) : (
                <div className="flex h-60 items-center justify-center bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.10),transparent_45%)]">
                  <div className="flex h-18 w-18 items-center justify-center rounded-[1.4rem] bg-primary text-white shadow-lg shadow-primary/20">
                    <FolderKanban size={30} />
                  </div>
                </div>
              )}

              <div className="p-6">
                <span className="rounded-full bg-primary/8 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                  {project.categoria}
                </span>

                <h3 className="mt-4 line-clamp-2 text-lg font-black tracking-tight text-dark">
                  {project.titulo}
                </h3>

                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {project.descripcion ||
                    "Proyecto desarrollado con calidad, estrategia y enfoque en resultados."}
                </p>

                <div className="mt-6">
                  <Link
                    to={project.path}
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-opacity hover:opacity-80"
                  >
                    Ver proyecto
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProyectosRelacionados;