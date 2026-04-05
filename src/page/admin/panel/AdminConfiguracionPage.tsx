/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState, type FC } from "react";
import { Save, Loader2, Building2, Eye } from "lucide-react";

import { useNotification } from "@/hooks/useNotificationHooks/useNotification";
import { useSiteConfig } from "@/hooks/useConfigSite";

import AdminPageHeader from "@/components/layouts/admin/panel/AdminPageHeader";
import AdminTabsCard from "@/components/layouts/admin/panel/AdminTabsCard";
import AdminMobileSaveBar from "@/components/layouts/admin/panel/AdminMobileSaveBar";

import AdminSiteConfigCompanySection from "@/components/layouts/admin/panel/siteConfig/AdminSiteConfigCompanySection";
import AdminSiteConfigPublicSection from "@/components/layouts/admin/panel/siteConfig/AdminSiteConfigPublicSection";
import AdminSiteConfigBrandingSection from "@/components/layouts/admin/panel/siteConfig/AdminSiteConfigBrandingSection";
import AdminSiteConfigSummarySection from "@/components/layouts/admin/panel/siteConfig/AdminSiteConfigSummarySection";

import {
  ADMIN_SITE_CONFIG_TABS,
  INITIAL_SITE_CONFIG_FORM,
  SITE_CONFIG_COMPANY_FIELDS,
  SITE_CONFIG_PUBLIC_FIELDS,
} from "@/constant/layouts/admin/panel/siteConfig/adminSiteConfig";

import type {
  AdminSiteConfigTab,
  AdminSiteConfigTabItem,
  SiteConfigFormState,
} from "@/interfaces/page/admin/panel/IAdminSiteConfig";

const AdminConfiguracionPage: FC = () => {
  const [tab, setTab] = useState<AdminSiteConfigTab>("empresa");
  const [form, setForm] = useState<SiteConfigFormState>(INITIAL_SITE_CONFIG_FORM);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);

  const [isLogoViewerOpen, setIsLogoViewerOpen] = useState<boolean>(false);
  const [isFaviconViewerOpen, setIsFaviconViewerOpen] =
    useState<boolean>(false);

  const {
    company,
    siteConfig,
    loading,
    saving,
    getSiteConfiguration,
    updateSiteConfiguration,
  } = useSiteConfig();

  const { showMessage } = useNotification();

  useEffect(() => {
    void getSiteConfiguration(({ success, message }) => {
      if (!success) {
        showMessage(message ?? "No se pudo obtener la configuración", "error");
      }
    });
  }, []);

  useEffect(() => {
    setForm({
      nombre: company?.nombre ?? "",
      razon_social: company?.razon_social ?? "",
      ruc: company?.ruc ?? "",
      email: company?.email ?? "",
      telefono: company?.telefono ?? "",
      direccion: company?.direccion ?? "",

      site_name: siteConfig?.site_name ?? "",
      site_description: siteConfig?.site_description ?? "",
      contact_phone: siteConfig?.contact_phone ?? "",
      contact_email: siteConfig?.contact_email ?? "",
      whatsapp_url: siteConfig?.whatsapp_url ?? "",
      facebook_url: siteConfig?.facebook_url ?? "",
      instagram_url: siteConfig?.instagram_url ?? "",

      logo_media_id: company?.logo?.id ?? company?.logo_media_id ?? null,
      favicon_media_id:
        company?.favicon?.id ?? company?.favicon_media_id ?? null,

      logo: company?.logo
        ? {
            id: company.logo.id,
            url: company.logo.url,
          }
        : null,

      favicon: company?.favicon
        ? {
            id: company.favicon.id,
            url: company.favicon.url,
          }
        : null,
    });

    setLogoFile(null);
    setFaviconFile(null);
    setIsLogoViewerOpen(false);
    setIsFaviconViewerOpen(false);
  }, [company, siteConfig]);

  const currentTab = useMemo<AdminSiteConfigTabItem>(() => {
    return (
      ADMIN_SITE_CONFIG_TABS.find((item) => item.key === tab) ??
      ADMIN_SITE_CONFIG_TABS[0]
    );
  }, [tab]);

  const handleChange =
    (key: keyof SiteConfigFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;

      setForm((prev) => ({
        ...prev,
        [key]: value,
      }));
    };

  const handleLogoChange = (url: string | null): void => {
    if (!url) {
      setLogoFile(null);
      setForm((prev) => ({
        ...prev,
        logo_media_id: null,
        logo: null,
      }));
      setIsLogoViewerOpen(false);
      return;
    }

    setForm((prev) => ({
      ...prev,
      logo: {
        id: prev.logo?.id ?? "",
        url,
      },
    }));
  };

 const handleFaviconChange = (url: string | null): void => {
  if (!url) {
    setFaviconFile(null);
    setForm((prev) => ({
      ...prev,
      favicon_media_id: null,
      favicon: null,
    }));
    setIsFaviconViewerOpen(false);
    return;
  }

  setForm((prev) => ({
    ...prev,
    favicon: {
      id: prev.favicon?.id ?? "",
      url,
    },
  }));
};

  const handleLogoUpload = async (file: File): Promise<string> => {
    const localUrl = URL.createObjectURL(file);

    setLogoFile(file);

    setForm((prev) => ({
      ...prev,
      logo: {
        id: prev.logo?.id ?? "",
        url: localUrl,
      },
    }));

    return localUrl;
  };

  const handleFaviconUpload = async (file: File): Promise<string> => {
    const localUrl = URL.createObjectURL(file);

    setFaviconFile(file);

    setForm((prev) => ({
      ...prev,
      favicon: {
        id: prev.favicon?.id ?? "",
        url: localUrl,
      },
    }));

    return localUrl;
  };

  const handleRemoveLogo = (): void => {
    setLogoFile(null);

    setForm((prev) => ({
      ...prev,
      logo_media_id: null,
      logo: null,
    }));

    setIsLogoViewerOpen(false);
  };

  const handleRemoveFavicon = (): void => {
    setFaviconFile(null);

    setForm((prev) => ({
      ...prev,
      favicon_media_id: null,
      favicon: null,
    }));

    setIsFaviconViewerOpen(false);
  };

  const handleSave = async (): Promise<void> => {
    await updateSiteConfiguration(
      {
        company: {
          nombre: form.nombre,
          razon_social: form.razon_social,
          ruc: form.ruc,
          email: form.email,
          telefono: form.telefono,
          direccion: form.direccion,
          logo_media_id: form.logo ? form.logo_media_id : null,
          favicon_media_id: form.favicon ? form.favicon_media_id : null,
        },
        sitio: {
          site_name: form.site_name,
          site_description: form.site_description,
          contact_phone: form.contact_phone,
          contact_email: form.contact_email,
          whatsapp_url: form.whatsapp_url,
          facebook_url: form.facebook_url,
          instagram_url: form.instagram_url,
        },
      },
      logoFile,
      faviconFile,
      ({ success, message }) => {
        showMessage(
          message ||
            (success
              ? "Configuración guardada correctamente"
              : "No se pudo guardar"),
          success ? "success" : "error"
        );

        if (success) {
          setLogoFile(null);
          setFaviconFile(null);
        }
      }
    );
  };

  const renderContent = (): React.ReactNode => {
    switch (tab) {
      case "empresa":
        return (
          <AdminSiteConfigCompanySection
            form={form}
            fields={SITE_CONFIG_COMPANY_FIELDS}
            onChange={handleChange}
          />
        );

      case "sitio":
        return (
          <AdminSiteConfigPublicSection
            form={form}
            fields={SITE_CONFIG_PUBLIC_FIELDS}
            onChange={handleChange}
          />
        );

      case "branding":
        return (
          <AdminSiteConfigBrandingSection
            logo={form.logo}
            favicon={form.favicon}
            isLogoViewerOpen={isLogoViewerOpen}
            isFaviconViewerOpen={isFaviconViewerOpen}
            onLogoChange={handleLogoChange}
            onFaviconChange={handleFaviconChange}
            onLogoUpload={handleLogoUpload}
            onFaviconUpload={handleFaviconUpload}
            onRemoveLogo={handleRemoveLogo}
            onRemoveFavicon={handleRemoveFavicon}
            onOpenLogoViewer={() => setIsLogoViewerOpen(true)}
            onCloseLogoViewer={() => setIsLogoViewerOpen(false)}
            onOpenFaviconViewer={() => setIsFaviconViewerOpen(true)}
            onCloseFaviconViewer={() => setIsFaviconViewerOpen(false)}
          />
        );

      case "resumen":
        return <AdminSiteConfigSummarySection form={form} />;

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-3xl border border-border bg-surface">
        <Loader2 className="animate-spin text-primary" size={34} />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader
        badgeText="Administración del Sitio"
        badgeIcon={Building2}
        title="Configuración del Sitio"
        description="Gestiona datos institucionales, contenido público, branding visual y enlaces globales desde una interfaz moderna, clara y ordenada."
        activeSectionLabel={currentTab.label}
        activeSectionIcon={currentTab.icon}
        secondaryAction={{
          text: "Ver sitio",
          icon: <Eye size={16} />,
          component: "a",
          href: "/",
          target: "_blank",
          rel: "noreferrer",
          variant: "secondary-outline",
        }}
        primaryAction={{
          text: "Guardar cambios",
          icon: <Save size={16} />,
          onClick: handleSave,
          loading: saving,
          disabled: saving,
          variant: "primary",
        }}
      />

      <AdminTabsCard
        title="Módulos de configuración"
        subtitle="Navega entre empresa, datos públicos, branding y resumen."
        tabs={ADMIN_SITE_CONFIG_TABS}
        activeTab={tab}
        onChangeTab={setTab}
      />

      <section className="space-y-4">{renderContent()}</section>

      <AdminMobileSaveBar
        text="Guardar cambios"
        loading={saving}
        disabled={saving}
        icon={<Save size={16} />}
        onClick={handleSave}
      />
    </div>
  );
};

export default AdminConfiguracionPage;