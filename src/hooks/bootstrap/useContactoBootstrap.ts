/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

import { useServices } from "@/hooks/useServices";
import { useSiteConfig } from "@/hooks/useConfigSite";
import { useAppState } from "@/hooks/useAppState";

type UseContactoBootstrapOptions = {
  withServices?: boolean;
  withSiteConfig?: boolean;
};

export const useContactoBootstrap = (
  options?: UseContactoBootstrapOptions
): void => {
  const { services, company, siteConfig } = useAppState();
  const { getServices } = useServices();
  const { getSiteConfiguration } = useSiteConfig();

  const withServices = options?.withServices ?? true;
  const withSiteConfig = options?.withSiteConfig ?? true;

  useEffect(() => {
    if (withServices && (!Array.isArray(services) || services.length === 0)) {
      void getServices();
    }
  }, [withServices, services]);

  useEffect(() => {
    const hasCompany = Boolean(company);
    const hasSiteConfig = Boolean(
      siteConfig && Object.keys(siteConfig).length > 0
    );

    if (withSiteConfig && (!hasCompany || !hasSiteConfig)) {
      void getSiteConfiguration();
    }
  }, [withSiteConfig, company, siteConfig]);
};