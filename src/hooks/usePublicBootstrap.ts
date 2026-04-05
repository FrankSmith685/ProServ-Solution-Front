import { useEffect, useRef } from "react";

import { useHeroSlides } from "@/hooks/useHeroSlides";
import { useConfigHome } from "@/hooks/useConfigHome";
import { useConfigNosotros } from "@/hooks/useConfigNosotros";
import { useProjects } from "@/hooks/useProjects";
import { useServices } from "@/hooks/useServices";
import { useSiteConfig } from "@/hooks/useConfigSite";
import { useTestimonials } from "@/hooks/useTestimonials";
import { useAppState } from "@/hooks/useAppState";

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isEmptyObject = (value: unknown): boolean => {
  return isPlainObject(value) && Object.keys(value).length === 0;
};

export const usePublicBootstrap = (): void => {
  const hasBootstrapped = useRef(false);

  const {
    services,
    heroSlide,
    configHome,
    configNosotros,
    projects,
    testimonials,
    company,
    siteConfig,
  } = useAppState();

  const { getServices } = useServices();
  const { getHeroSlides } = useHeroSlides();
  const { getConfigHome } = useConfigHome();
  const { getConfigNosotros } = useConfigNosotros();
  const { getProjects } = useProjects();
  const { getTestimonials } = useTestimonials();
  const { getSiteConfiguration } = useSiteConfig();

  useEffect(() => {
    if (hasBootstrapped.current) return;
    hasBootstrapped.current = true;

    const requests: Promise<void>[] = [];

    if (!Array.isArray(services) || services.length === 0) {
      requests.push(getServices());
    }

    if (!Array.isArray(heroSlide) || heroSlide.length === 0) {
      requests.push(getHeroSlides());
    }

    if (!configHome || isEmptyObject(configHome)) {
      requests.push(getConfigHome());
    }

    if (!configNosotros || isEmptyObject(configNosotros)) {
      requests.push(getConfigNosotros());
    }

    if (!Array.isArray(projects) || projects.length === 0) {
      requests.push(getProjects());
    }

    if (!Array.isArray(testimonials) || testimonials.length === 0) {
      requests.push(getTestimonials());
    }

    if (!company || !siteConfig || isEmptyObject(siteConfig)) {
      requests.push(getSiteConfiguration());
    }

    void Promise.allSettled(requests);
  }, [
    services,
    heroSlide,
    configHome,
    configNosotros,
    projects,
    testimonials,
    company,
    siteConfig,
    getServices,
    getHeroSlides,
    getConfigHome,
    getConfigNosotros,
    getProjects,
    getTestimonials,
    getSiteConfiguration,
  ]);
};