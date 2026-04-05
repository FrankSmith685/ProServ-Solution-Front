/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState, type ChangeEvent, type FC } from "react";
import { Eye, Building2, Save, Loader2 } from "lucide-react";

import { useConfigNosotros } from "@/hooks/useConfigNosotros";
import { useMedia } from "@/hooks/useMedia";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";

import NosotrosHistoriaSection from "@/components/layouts/admin/panel/nosotros/NosotrosHistoriaSection";
import NosotrosMisionVisionSection from "@/components/layouts/admin/panel/nosotros/NosotrosMisionVisionSection";
import NosotrosValoresSection from "@/components/layouts/admin/panel/nosotros/NosotrosValoresSection";

// import AdminPageHeader from "@/components/ui/admin/AdminPageHeader";
// import AdminTabsCard from "@/components/ui/admin/AdminTabsCard";
// import AdminMobileSaveBar from "@/components/ui/admin/AdminMobileSaveBar";

import type {
  AdminNosotrosTab,
  AdminNosotrosTabItem,
  NosotrosFormState,
} from "@/interfaces/page/admin/panel/IAdminNosotros";

import type {
  ConfigNosotrosMedia,
  ConfigNosotrosPayload,
} from "@/interfaces/hook/IUseConfigNosotros";

import {
  ADMIN_NOSOTROS_TABS,
  INITIAL_NOSOTROS_FORM,
  NOSOTROS_VALUE_FIELDS,
} from "@/constant/layouts/admin/panel/nosotros/adminNosotros";
import AdminPageHeader from "@/components/layouts/admin/panel/AdminPageHeader";
import AdminTabsCard from "@/components/layouts/admin/panel/AdminTabsCard";
import AdminMobileSaveBar from "@/components/layouts/admin/panel/AdminMobileSaveBar";

const AdminNosotrosPage: FC = () => {
  const [tab, setTab] = useState<AdminNosotrosTab>("historia");
  const [form, setForm] = useState<NosotrosFormState>(INITIAL_NOSOTROS_FORM);

  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [initialMediaId, setInitialMediaId] = useState<string | null>(null);
  const [isHistoryViewerOpen, setIsHistoryViewerOpen] = useState<boolean>(false);

  const {
    configNosotros,
    getConfigNosotros,
    updateConfigNosotros,
    loading,
    saving,
  } = useConfigNosotros();

  const { uploadMedia } = useMedia();
  const { showMessage } = useNotification();

  const toStr = (value: unknown): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") return "";
    return String(value);
  };

  const getMediaObject = (value: unknown): ConfigNosotrosMedia | null => {
    if (!value || typeof value !== "object") return null;

    const media = value as Partial<ConfigNosotrosMedia>;

    if (typeof media.id === "string" && typeof media.url === "string") {
      return {
        id: media.id,
        url: media.url,
      };
    }

    return null;
  };

  const getMediaUrl = (value: unknown): string | null => {
    if (typeof value === "string" && value.trim() !== "") {
      return value;
    }

    const media = getMediaObject(value);
    return media?.url ?? null;
  };

  useEffect(() => {
    const init = async (): Promise<void> => {
      await getConfigNosotros();
    };

    void init();
  }, []);

  useEffect(() => {
    if (!configNosotros) return;

    const media = getMediaObject(configNosotros.historia_imagen);
    const mediaUrl = getMediaUrl(configNosotros.historia_imagen);

    setInitialMediaId(media?.id ?? null);
    setFile(null);
    setImageUrl(mediaUrl);
    setIsHistoryViewerOpen(false);

    setForm({
      historia_titulo: toStr(configNosotros.historia_titulo),
      historia_p1: toStr(configNosotros.historia_p1),
      historia_p2: toStr(configNosotros.historia_p2),
      historia_p3: toStr(configNosotros.historia_p3),
      historia_imagen: media ?? mediaUrl ?? "",

      mision: toStr(configNosotros.mision),
      vision: toStr(configNosotros.vision),

      valor_1_titulo: toStr(configNosotros.valor_1_titulo),
      valor_1_desc: toStr(configNosotros.valor_1_desc),
      valor_2_titulo: toStr(configNosotros.valor_2_titulo),
      valor_2_desc: toStr(configNosotros.valor_2_desc),
      valor_3_titulo: toStr(configNosotros.valor_3_titulo),
      valor_3_desc: toStr(configNosotros.valor_3_desc),
      valor_4_titulo: toStr(configNosotros.valor_4_titulo),
      valor_4_desc: toStr(configNosotros.valor_4_desc),
    });
  }, [configNosotros]);

  const currentTab = useMemo<AdminNosotrosTabItem>(() => {
    return (
      ADMIN_NOSOTROS_TABS.find((item) => item.key === tab) ??
      ADMIN_NOSOTROS_TABS[0]
    );
  }, [tab]);

  const handleChange = <K extends keyof NosotrosFormState>(
    key: K,
    value: NosotrosFormState[K]
  ): void => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTextChange =
    (key: keyof NosotrosFormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      handleChange(key, e.target.value as NosotrosFormState[typeof key]);
    };

  const handleHistoryImageUploaderChange = (url: string | null): void => {
    if (!url) {
      setImageUrl(null);
      setFile(null);
      handleChange("historia_imagen", "");
      setIsHistoryViewerOpen(false);
      return;
    }

    setImageUrl(url);

    if (!url.startsWith("blob:")) {
      setFile(null);
      handleChange("historia_imagen", url);
    }
  };

  const handleUploadHistoryImage = async (
    selectedFile: File
  ): Promise<string> => {
    setFile(selectedFile);

    const localUrl = URL.createObjectURL(selectedFile);
    setImageUrl(localUrl);
    handleChange("historia_imagen", localUrl);

    return localUrl;
  };

  const handleSave = async (): Promise<void> => {
    try {
      const payload: ConfigNosotrosPayload = {
        historia_titulo: form.historia_titulo,
        historia_p1: form.historia_p1,
        historia_p2: form.historia_p2,
        historia_p3: form.historia_p3,

        mision: form.mision,
        vision: form.vision,

        valor_1_titulo: form.valor_1_titulo,
        valor_1_desc: form.valor_1_desc,
        valor_2_titulo: form.valor_2_titulo,
        valor_2_desc: form.valor_2_desc,
        valor_3_titulo: form.valor_3_titulo,
        valor_3_desc: form.valor_3_desc,
        valor_4_titulo: form.valor_4_titulo,
        valor_4_desc: form.valor_4_desc,
      };

      const deletedMediaIds: string[] = [];

      const currentUrl =
        form.historia_imagen &&
        typeof form.historia_imagen === "object" &&
        "url" in form.historia_imagen
          ? form.historia_imagen.url
          : typeof form.historia_imagen === "string"
            ? form.historia_imagen
            : null;

      if (file) {
        const uploaded = await uploadMedia(file, "nosotros");
        if (!uploaded) {
          throw new Error("Error subiendo imagen");
        }

        payload.historia_imagen = uploaded.id;

        if (initialMediaId) {
          deletedMediaIds.push(initialMediaId);
        }
      } else if (!imageUrl) {
        payload.historia_imagen = "";

        if (initialMediaId) {
          deletedMediaIds.push(initialMediaId);
        }
      } else if (!imageUrl.startsWith("blob:")) {
        if (initialMediaId && currentUrl === imageUrl) {
          payload.historia_imagen = initialMediaId;
        } else {
          payload.historia_imagen = imageUrl;

          if (initialMediaId) {
            deletedMediaIds.push(initialMediaId);
          }
        }
      } else if (initialMediaId) {
        payload.historia_imagen = initialMediaId;
      } else {
        payload.historia_imagen = "";
      }

      if (deletedMediaIds.length > 0) {
        payload.deletedMediaIds = deletedMediaIds;
      }

      await updateConfigNosotros(payload, ({ success, message }) => {
        showMessage(
          message || (success ? "Configuración actualizada" : "Error"),
          success ? "success" : "error"
        );
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al guardar la configuración.";

      showMessage(message, "error");
    }
  };

  const renderContent = (): React.ReactNode => {
    switch (tab) {
      case "historia":
        return (
          <NosotrosHistoriaSection
            form={form}
            imageUrl={imageUrl}
            isHistoryViewerOpen={isHistoryViewerOpen}
            onTextChange={handleTextChange}
            onImageChange={handleHistoryImageUploaderChange}
            onImageUpload={handleUploadHistoryImage}
            onOpenViewer={() => setIsHistoryViewerOpen(true)}
            onCloseViewer={() => setIsHistoryViewerOpen(false)}
          />
        );

      case "misionVision":
        return (
          <NosotrosMisionVisionSection
            form={form}
            onTextChange={handleTextChange}
          />
        );

      case "valores":
        return (
          <NosotrosValoresSection
            form={form}
            values={NOSOTROS_VALUE_FIELDS}
            onTextChange={handleTextChange}
          />
        );

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
        badgeText="Administración de Nosotros"
        badgeIcon={Building2}
        title="Quiénes Somos"
        description="Gestiona la historia, misión, visión y valores desde una interfaz moderna, clara y alineada con el panel administrativo."
        activeSectionLabel={currentTab.label}
        activeSectionIcon={currentTab.icon}
        secondaryAction={{
          text: "Ver página",
          icon: <Eye size={16} />,
          component: "a",
          href: "/nosotros",
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
        title="Módulos de contenido"
        subtitle="Cambia entre los bloques principales de la página Nosotros."
        tabs={ADMIN_NOSOTROS_TABS}
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

export default AdminNosotrosPage;