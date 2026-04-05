import { useEffect, useRef } from "react";

import { useServices } from "@/hooks/useServices";
import { useSiteConfig } from "@/hooks/useConfigSite";
import { useAppState } from "@/hooks/useAppState";

import { isEmptyObject } from "./bootstrap.utils";

export const useLayoutBootstrap = (): void => {
  const hasBootstrapped = useRef(false);

  const { services, company, siteConfig } = useAppState();

  const { getServices } = useServices();
  const { getSiteConfiguration } = useSiteConfig();

  useEffect(() => {
    if (hasBootstrapped.current) return;
    hasBootstrapped.current = true;

    const requests: Promise<void>[] = [];

    if (!Array.isArray(services) || services.length === 0) {
      requests.push(getServices());
    }

    if (!company || !siteConfig || isEmptyObject(siteConfig)) {
      requests.push(getSiteConfiguration());
    }

    void Promise.allSettled(requests);
  }, [
    services,
    company,
    siteConfig,
    getServices,
    getSiteConfiguration,
  ]);
};