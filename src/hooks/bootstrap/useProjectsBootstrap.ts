/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

import { useProjects } from "@/hooks/useProjects";
import { useCategories } from "@/hooks/useCategories";
import { useServices } from "@/hooks/useServices";
import { useSiteConfig } from "@/hooks/useConfigSite";
import { useTestimonials } from "@/hooks/useTestimonials";
import { useConfigHome } from "@/hooks/useConfigHome";
import { useAppState } from "@/hooks/useAppState";

type UseProjectsBootstrapOptions = {
  withTestimonials?: boolean;
  withConfigHome?: boolean;
};

export const useProjectsBootstrap = (
  options?: UseProjectsBootstrapOptions
): void => {
  const { projects, categories, services, company, siteConfig, testimonials, configHome } =
    useAppState();

  const { getProjects } = useProjects();
  const { getCategories } = useCategories();
  const { getServices } = useServices();
  const { getSiteConfiguration } = useSiteConfig();
  const { getTestimonials } = useTestimonials();
  const { getConfigHome } = useConfigHome();

  useEffect(() => {
    if (!Array.isArray(projects) || projects.length === 0) {
      getProjects();
    }

    if (!Array.isArray(categories) || categories.length === 0) {
      getCategories();
    }

    if (!Array.isArray(services) || services.length === 0) {
      getServices();
    }

    if (!company || !siteConfig) {
      getSiteConfiguration();
    }

    if (options?.withTestimonials && (!Array.isArray(testimonials) || testimonials.length === 0)) {
      getTestimonials();
    }

    if (options?.withConfigHome && (!configHome || Object.keys(configHome).length === 0)) {
      getConfigHome();
    }
  }, []);
};