import { useState } from "react";
import { api, apiWithAuth } from "../api/apiConfig";
import { handleApiError } from "../api/apiError";

import type { BasicCallback } from "@/interfaces/helpers/IBasicCallbacks";
import type {
  CompanyResponse,
  SiteConfigPayload,
  SiteConfigResponse,
  UseSiteConfig,
} from "@/interfaces/hook/IUseConfigSite";

import { useMedia } from "./useMedia";
import { useAppState } from "./useAppState";


export const useSiteConfig = (): UseSiteConfig => {
  const {company, setCompany, siteConfig, setSiteConfig} = useAppState();
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const { uploadMedia, deleteMedia } = useMedia();

  const getSiteConfiguration = async (callback?: BasicCallback): Promise<void> => {
    setLoading(true);

    try {
      const [companyRes, siteRes] = await Promise.all([
        api.get<CompanyResponse>("/company"),
        api.get<SiteConfigResponse>("/config/sitio"),
      ]);

      if (!companyRes.data.success) {
        throw new Error(companyRes.data.message);
      }

      if (!siteRes.data.success) {
        throw new Error(siteRes.data.message);
      }

      setCompany(companyRes.data.data ?? null);
      setSiteConfig({
        ...siteConfig,
        ...(siteRes.data.data ?? {}),
      });

      callback?.({
        success: true,
        message: "Configuración del sitio obtenida correctamente",
      });
    } catch (error) {
      const handled = handleApiError(error);

      callback?.({
        success: false,
        message: handled.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSiteConfiguration = async (
    payload: SiteConfigPayload,
    logoFile?: File | null,
    faviconFile?: File | null,
    callback?: BasicCallback
  ): Promise<void> => {
    setSaving(true);

    try {
      let nextLogoMediaId = payload.company.logo_media_id ?? null;
      let nextFaviconMediaId = payload.company.favicon_media_id ?? null;

      const oldLogoMediaId = company?.logo_media_id ?? null;
      const oldFaviconMediaId = company?.favicon_media_id ?? null;

      if (logoFile) {
        const uploadedLogo = await uploadMedia(logoFile, "general");
        if (!uploadedLogo) throw new Error("Error subiendo logo");
        nextLogoMediaId = uploadedLogo.id;
      }

      if (faviconFile) {
        const uploadedFavicon = await uploadMedia(faviconFile, "general");
        if (!uploadedFavicon) throw new Error("Error subiendo favicon");
        nextFaviconMediaId = uploadedFavicon.id;
      }

      const companyPayload = {
        ...payload.company,
        logo_media_id: nextLogoMediaId,
        favicon_media_id: nextFaviconMediaId,
      };

      const [companyRes, siteRes] = await Promise.all([
        apiWithAuth.put<CompanyResponse>("/company", companyPayload),
        apiWithAuth.put<SiteConfigResponse>("/config/sitio", payload.sitio),
      ]);

      if (!companyRes.data.success) {
        throw new Error(companyRes.data.message);
      }

      if (!siteRes.data.success) {
        throw new Error(siteRes.data.message);
      }

      if (oldLogoMediaId && nextLogoMediaId !== oldLogoMediaId) {
        await deleteMedia(oldLogoMediaId);
      }

      if (oldFaviconMediaId && nextFaviconMediaId !== oldFaviconMediaId) {
        await deleteMedia(oldFaviconMediaId);
      }

      await getSiteConfiguration();

      callback?.({
        success: true,
        message:
          siteRes.data.message ||
          companyRes.data.message ||
          "Configuración actualizada correctamente",
      });
    } catch (error) {
      const handled = handleApiError(error);

      callback?.({
        success: false,
        message: handled.message,
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    company,
    siteConfig,
    loading,
    saving,
    getSiteConfiguration,
    updateSiteConfiguration,
  };
};