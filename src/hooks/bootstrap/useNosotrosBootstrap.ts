import { useEffect, useRef } from "react";

import { useConfigNosotros } from "@/hooks/useConfigNosotros";
import { useSiteConfig } from "@/hooks/useConfigSite";
import { useTestimonials } from "@/hooks/useTestimonials";
import { useServices } from "@/hooks/useServices";
import { useAppState } from "@/hooks/useAppState";

import { isEmptyObject } from "./bootstrap.utils";

type UseNosotrosBootstrapOptions = {
  withTestimonials?: boolean;
  withServices?: boolean;
};

export const useNosotrosBootstrap = (
  options: UseNosotrosBootstrapOptions = {}
): void => {
  const {
    withTestimonials = true,
    withServices = false,
  } = options;

  const hasBootstrapped = useRef(false);

  const {
    configNosotros,
    company,
    siteConfig,
    testimonials,
    services,
  } = useAppState();

  const { getConfigNosotros } = useConfigNosotros();
  const { getSiteConfiguration } = useSiteConfig();
  const { getTestimonials } = useTestimonials();
  const { getServices } = useServices();

  useEffect(() => {
    if (hasBootstrapped.current) return;
    hasBootstrapped.current = true;

    const requests: Promise<void>[] = [];

    if (!configNosotros || isEmptyObject(configNosotros)) {
      requests.push(getConfigNosotros());
    }

    if (!company || !siteConfig || isEmptyObject(siteConfig)) {
      requests.push(getSiteConfiguration());
    }

    if (withTestimonials && (!Array.isArray(testimonials) || testimonials.length === 0)) {
      requests.push(getTestimonials());
    }

    if (withServices && (!Array.isArray(services) || services.length === 0)) {
      requests.push(getServices());
    }

    void Promise.allSettled(requests);
  }, [
    configNosotros,
    company,
    siteConfig,
    testimonials,
    services,
    withTestimonials,
    withServices,
    getConfigNosotros,
    getSiteConfiguration,
    getTestimonials,
    getServices,
  ]);
};