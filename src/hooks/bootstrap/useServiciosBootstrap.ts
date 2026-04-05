import { useEffect, useRef } from "react";

import { useTestimonials } from "@/hooks/useTestimonials";
import { useConfigHome } from "@/hooks/useConfigHome";
import { useAppState } from "@/hooks/useAppState";

type UseServiciosBootstrapOptions = {
  withTestimonials?: boolean;
  withConfigHome?: boolean;
};

const isPlainObject = (
  value: unknown
): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isEmptyObject = (value: unknown): boolean => {
  return isPlainObject(value) && Object.keys(value).length === 0;
};

export const useServiciosBootstrap = (
  options: UseServiciosBootstrapOptions = {}
): void => {
  const { withTestimonials = false, withConfigHome = false } = options;
  const hasBootstrapped = useRef(false);

  const { testimonials, configHome } = useAppState();

  const { getTestimonials } = useTestimonials();
  const { getConfigHome } = useConfigHome();

  useEffect(() => {
    if (hasBootstrapped.current) return;
    hasBootstrapped.current = true;

    const requests: Promise<void>[] = [];

    if (withTestimonials && (!Array.isArray(testimonials) || testimonials.length === 0)) {
      requests.push(getTestimonials());
    }

    if (withConfigHome && (!configHome || isEmptyObject(configHome))) {
      requests.push(getConfigHome());
    }

    void Promise.allSettled(requests);
  }, [
    withTestimonials,
    withConfigHome,
    testimonials,
    configHome,
    getTestimonials,
    getConfigHome,
  ]);
};