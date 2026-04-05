import { useMemo, type FC } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  FolderKanban,
  Sparkles,
  LayoutGrid,
} from "lucide-react";

import { useProjects } from "@/hooks/useProjects";
import { useAppState } from "@/hooks/useAppState";
import { CustomButton } from "@/components/ui/kit/CustomButton";

import type { Project } from "@/interfaces/hook/IUseProjects";

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

type ProjectCardItem = {
  id: string;
  titulo: string;
  categoria: string;
  cliente: string;
  imagen_url: string;
};

type ProjectViewSource = Project & {
  imagen_url?: string | null;
  images?: ProjectImageRef[] | null;
  categoria?: ProjectCategoryRef | null;
  category?: ProjectCategoryRef | null;
  categoria_nombre?: string | null;
  category_name?: string | null;
};

const MAX_VISIBLE_PROJECTS = 5;

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

const getProjectImage = (project: ProjectViewSource): string => {
  const directImage = buildAbsoluteUrl(safeText(project.imagen_url));
  if (directImage) return directImage;

  if (Array.isArray(project.images) && project.images.length > 0) {
    const first = project.images[0];

    return (
      buildAbsoluteUrl(safeText(first.media?.url)) ||
      buildAbsoluteUrl(safeText(first.url)) ||
      buildAbsoluteUrl(safeText(first.imagen_url))
    );
  }

  return "";
};

const getProjectCategory = (project: ProjectViewSource): string => {
  return (
    safeText(project.categoria?.nombre) ||
    safeText(project.category?.nombre) ||
    safeText(project.categoria_nombre) ||
    safeText(project.category_name)
  );
};

const mapProjectToCard = (project: ProjectViewSource): ProjectCardItem | null => {
  const id = safeText(project.id);
  const titulo = safeText(project.titulo);
  const imagen_url = getProjectImage(project);

  if (!id || !titulo || !imagen_url) {
    return null;
  }

  return {
    id,
    titulo,
    categoria: getProjectCategory(project),
    cliente: safeText(project.cliente),
    imagen_url,
  };
};

const ProjectsSectionSkeleton: FC = () => {
  return (
    <section className="relative overflow-hidden bg-surface py-20 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_36%)]" />
      <div className="absolute left-0 top-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="h-8 w-40 animate-pulse rounded-full bg-primary/10" />
            <div className="mt-5 h-12 w-11/12 animate-pulse rounded-2xl bg-primary/10" />
            <div className="mt-3 h-12 w-8/12 animate-pulse rounded-2xl bg-primary/10" />
            <div className="mt-5 h-4 w-full animate-pulse rounded-full bg-muted" />
            <div className="mt-3 h-4 w-10/12 animate-pulse rounded-full bg-muted" />
          </div>

          <div className="h-12 w-52 animate-pulse rounded-2xl bg-primary/10" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
          <div className="h-140 animate-pulse rounded-4xl bg-primary/10" />
          <div className="h-140 animate-pulse rounded-4xl bg-primary/10" />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`project-compact-skeleton-${index}`}
              className="h-45 animate-pulse rounded-3xl bg-primary/10"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectsEmptyState: FC = () => {
  return (
    <div className="relative overflow-hidden rounded-4xl border border-border bg-surface px-6 py-14 text-center shadow-sm md:px-10 md:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.10),transparent_42%)]" />
      <div className="absolute -left-16 top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-16 bottom-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative">
        <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-[1.4rem] bg-primary shadow-lg shadow-primary/25 ring-8 ring-primary/10">
          <FolderKanban size={30} className="text-white" />
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          <Sparkles size={14} />
          Portafolio en preparación
        </div>

        <h3 className="mt-5 text-2xl font-black tracking-tight text-dark md:text-3xl">
          Aún no hay proyectos destacados
        </h3>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Esta sección mostrará automáticamente los proyectos activos y marcados
          como destacados desde el sistema.
        </p>
      </div>
    </div>
  );
};

const ProjectsSectionHeader: FC<{ total: number }> = ({ total }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
    >
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
          <Sparkles size={14} />
          Casos de éxito
        </div>

        <h2 className="mt-5 text-3xl font-black tracking-tight text-dark sm:text-4xl md:text-5xl">
          Proyectos con una presencia más sólida y premium
        </h2>

        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Un layout más editorial y balanceado, pensado para que desktop se vea
          más elegante y para que el contenido conserve contraste incluso con
          imágenes claras.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {total > 0 ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-bold text-primary">
            <LayoutGrid size={14} />
            {total} proyecto{total === 1 ? "" : "s"} destacado
            {total === 1 ? "" : "s"}
          </div>
        ) : null}

        <CustomButton
          text="Ver portafolio"
          variant="secondary-outline"
          size="lg"
          icon={<ArrowRight size={18} />}
          component={Link}
          to="/proyectos"
          className="px-4! gap-1!"
        />
      </div>
    </motion.div>
  );
};

const ProjectBadge: FC<{ text: string; dark?: boolean }> = ({
  text,
  dark = true,
}) => {
  if (!text) return null;

  return (
    <div
      className={
        dark
          ? "inline-flex items-center rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md"
          : "inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-primary"
      }
    >
      {text}
    </div>
  );
};

const ImageContrastOverlay: FC<{ variant?: "hero" | "side" | "compact" }> = ({
  variant = "hero",
}) => {
  if (variant === "compact") {
    return (
      <>
        <div className="absolute inset-0 bg-black/28" />
        <div className="absolute inset-0 bg-linear-to-r from-black/40 via-black/18 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-black/38 via-transparent to-transparent" />
      </>
    );
  }

  if (variant === "side") {
    return (
      <>
        <div className="absolute inset-0 bg-black/34" />
        <div className="absolute inset-0 bg-linear-to-t from-[#08111f]/96 via-[#08111f]/50 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/28" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_24%)]" />
      </>
    );
  }

  return (
    <>
      <div className="absolute inset-0 bg-black/38" />
      <div className="absolute inset-0 bg-linear-to-r from-[#07111d]/96 via-[#0b1728]/68 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-black/72 via-black/18 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_26%)]" />
      <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.34)]" />
    </>
  );
};

const FeaturedProjectCard: FC<{ project: ProjectCardItem }> = ({ project }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden rounded-4xl border border-border bg-surface shadow-[0_20px_60px_rgba(0,0,0,0.10)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_80px_rgba(0,0,0,0.14)]"
    >
      <Link to={`/proyectos/${project.id}`} className="block h-full">
        <div className="relative h-140 overflow-hidden">
          <img
            src={project.imagen_url}
            alt={project.titulo}
            className="h-full w-full object-cover brightness-[0.78] contrast-[1.05] saturate-[1.02] transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          <ImageContrastOverlay variant="hero" />

          <div className="absolute left-5 top-5 flex flex-wrap gap-3 sm:left-6 sm:top-6">
            <ProjectBadge text={project.categoria || "Proyecto"} />
            <div className="inline-flex items-center rounded-full border border-white/12 bg-black/35 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white/90 backdrop-blur-md">
              Destacado
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-8">
            <div className="max-w-2xl rounded-3xl border border-white/12 bg-black/40 p-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-6">
              <div className="flex items-center gap-2 text-white/74">
                <BriefcaseBusiness size={16} />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
                  Proyecto principal
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
                {project.titulo}
              </h3>

              {project.cliente ? (
                <p className="mt-3 text-sm font-medium text-white/78 sm:text-base">
                  {project.cliente}
                </p>
              ) : null}

              <div className="mt-5 flex items-center gap-2 text-sm font-bold text-white transition-all duration-200 group-hover:gap-3">
                Explorar proyecto
                <ArrowUpRight size={18} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

const TallProjectCard: FC<{ project: ProjectCardItem }> = ({ project }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.44 }}
      className="group relative overflow-hidden rounded-4xl border border-border bg-surface shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)]"
    >
      <Link to={`/proyectos/${project.id}`} className="block h-full">
        <div className="relative h-140 overflow-hidden">
          <img
            src={project.imagen_url}
            alt={project.titulo}
            className="h-full w-full object-cover brightness-[0.8] contrast-[1.04] saturate-[1.02] transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          <ImageContrastOverlay variant="side" />

          <div className="absolute left-5 top-5">
            <ProjectBadge text={project.categoria || "Proyecto"} />
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5">
            <div className="rounded-[1.35rem] border border-white/10 bg-black/38 p-5 backdrop-blur-xl">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/72">
                Caso destacado
              </div>

              <h3 className="mt-3 line-clamp-3 text-2xl font-black leading-tight tracking-tight text-white">
                {project.titulo}
              </h3>

              {project.cliente ? (
                <p className="mt-3 line-clamp-2 text-sm text-white/78">
                  {project.cliente}
                </p>
              ) : null}

              <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white transition-all duration-200 group-hover:gap-3">
                Ver proyecto
                <ArrowUpRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

const CompactProjectCard: FC<{
  project: ProjectCardItem;
  index: number;
}> = ({ project, index }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.38, delay: index * 0.06 }}
      className="group overflow-hidden rounded-3xl border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <Link
        to={`/proyectos/${project.id}`}
        className="grid h-full grid-cols-[110px_minmax(0,1fr)] sm:grid-cols-[130px_minmax(0,1fr)]"
      >
        <div className="relative min-h-45 overflow-hidden">
          <img
            src={project.imagen_url}
            alt={project.titulo}
            className="h-full w-full object-cover brightness-[0.82] contrast-[1.04] transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <ImageContrastOverlay variant="compact" />
        </div>

        <div className="flex flex-col justify-between p-5">
          <div>
            <ProjectBadge text={project.categoria || "Proyecto"} dark={false} />

            <h3 className="mt-4 line-clamp-2 text-lg font-black leading-snug tracking-tight text-dark">
              {project.titulo}
            </h3>

            {project.cliente ? (
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {project.cliente}
              </p>
            ) : null}
          </div>

          <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary transition-all duration-200 group-hover:gap-3">
            Explorar
            <ArrowRight size={16} />
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

const ProjectsSectionFooter: FC<{
  hiddenProjectsCount: number;
}> = ({ hiddenProjectsCount }) => {
  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-4 md:mt-12">
      {hiddenProjectsCount > 0 ? (
        <div className="rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-center text-xs font-bold text-primary sm:text-sm">
          +{hiddenProjectsCount} proyecto
          {hiddenProjectsCount === 1 ? "" : "s"} más disponible
          {hiddenProjectsCount === 1 ? "" : "s"}
        </div>
      ) : null}

      <CustomButton
        text="Ver todos los proyectos"
        variant="primary"
        size="lg"
        icon={<ArrowRight size={18} />}
        component={Link}
        to="/proyectos"
        className="min-w-60! px-4! gap-1!"
      />
    </div>
  );
};

const ProjectsSection: FC = () => {
  const { projects } = useAppState();
  const { loading } = useProjects();


  const projectList = useMemo<ProjectCardItem[]>(() => {
    return (
      projects
        ?.filter((project) => project.activo !== false)
        .filter((project) => project.destacado === true)
        .map((project) => mapProjectToCard(project as ProjectViewSource))
        .filter((project): project is ProjectCardItem => project !== null) ?? []
    );
  }, [projects]);

  const visibleProjects = useMemo<ProjectCardItem[]>(() => {
    return projectList.slice(0, MAX_VISIBLE_PROJECTS);
  }, [projectList]);

  const featuredProject = useMemo<ProjectCardItem | null>(() => {
    return visibleProjects[0] ?? null;
  }, [visibleProjects]);

  const tallProject = useMemo<ProjectCardItem | null>(() => {
    return visibleProjects[1] ?? null;
  }, [visibleProjects]);

  const compactProjects = useMemo<ProjectCardItem[]>(() => {
    return visibleProjects.slice(2, 5);
  }, [visibleProjects]);

  const hiddenProjectsCount = useMemo<number>(() => {
    return Math.max(projectList.length - MAX_VISIBLE_PROJECTS, 0);
  }, [projectList.length]);

  if (loading && !projectList.length) {
    return <ProjectsSectionSkeleton />;
  }

  return (
    <section className="relative overflow-hidden bg-surface py-20 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_35%)]" />
      <div className="absolute left-0 top-20 h-52 w-52 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute right-0 top-1/3 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <ProjectsSectionHeader total={projectList.length} />

        {!projectList.length ? (
          <ProjectsEmptyState />
        ) : featuredProject ? (
          <>
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
              <FeaturedProjectCard project={featuredProject} />
              {tallProject ? <TallProjectCard project={tallProject} /> : null}
            </div>

            {compactProjects.length > 0 ? (
              <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {compactProjects.map((project, index) => (
                  <CompactProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                  />
                ))}
              </div>
            ) : null}

            <ProjectsSectionFooter hiddenProjectsCount={hiddenProjectsCount} />
          </>
        ) : null}
      </div>
    </section>
  );
};

export default ProjectsSection;