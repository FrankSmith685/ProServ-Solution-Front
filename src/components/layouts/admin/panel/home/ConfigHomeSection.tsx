/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  Save,
  Type,
  Loader2,
  LayoutPanelTop,
  BarChart3,
  Image as ImageIcon,
  Megaphone,
} from "lucide-react";

import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomImageUploader } from "@/components/ui/kit/CustomImageUploader";
import { CustomImageViewer } from "@/components/ui/media/CustomImageViewer";

import { useConfigHome } from "@/hooks/useConfigHome";
import { useMedia } from "@/hooks/useMedia";
import { useNotification } from "@/hooks/useNotificationHooks/useNotification";
import { useAppState } from "@/hooks/useAppState";

import type {
  ConfigHomePayload,
  ConfigMedia,
} from "@/interfaces/hook/IUseConfigHome";
import type {
  FormState,
  StatFieldItem,
} from "@/interfaces/layouts/admin/panel/home/IConfigHome";

const INITIAL_FORM: FormState = {
  hero_title: "",
  hero_subtitle: "",
  hero_cta: "",
  services_title: "",
  projects_title: "",
  stats_anos_valor: "",
  stats_proyectos_valor: "",
  stats_clientes_valor: "",
  stats_colaboradores_valor: "",
  about_titulo: "",
  about_descripcion: "",
  about_descripcion2: "",
  about_anos: "",
  about_imagen: "",
  cta_titulo: "",
  cta_descripcion: "",
};

const STAT_FIELDS: StatFieldItem[] = [
  { key: "stats_anos_valor", label: "Años" },
  { key: "stats_proyectos_valor", label: "Proyectos" },
  { key: "stats_clientes_valor", label: "Clientes" },
  { key: "stats_colaboradores_valor", label: "Colaboradores" },
];

const sectionCardClass =
  "rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-6";

const ConfigHomeSection = () => {
  const { getConfigHome, updateConfigHome } = useConfigHome();
  const { configHome } = useAppState();
  const { uploadMedia } = useMedia();
  const { showMessage } = useNotification();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const [initialMediaId, setInitialMediaId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  const toStr = (value: unknown): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") return "";
    return String(value);
  };

  const getMediaObject = (value: unknown): ConfigMedia | null => {
    if (!value || typeof value !== "object") return null;

    const media = value as Partial<ConfigMedia>;

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
    const init = async () => {
      setLoading(true);
      await getConfigHome();
      setLoading(false);
    };

    void init();
  }, []);

  useEffect(() => {
    if (!configHome) return;

    const media = getMediaObject(configHome.about_imagen);
    const mediaUrl = getMediaUrl(configHome.about_imagen);

    setInitialMediaId(media?.id ?? null);
    setFile(null);

    setForm({
      hero_title: toStr(configHome.hero_title),
      hero_subtitle: toStr(configHome.hero_subtitle),
      hero_cta: toStr(configHome.hero_cta),
      services_title: toStr(configHome.services_title),
      projects_title: toStr(configHome.projects_title),
      stats_anos_valor: toStr(configHome.stats_anos_valor),
      stats_proyectos_valor: toStr(configHome.stats_proyectos_valor),
      stats_clientes_valor: toStr(configHome.stats_clientes_valor),
      stats_colaboradores_valor: toStr(configHome.stats_colaboradores_valor),
      about_titulo: toStr(configHome.about_titulo),
      about_descripcion: toStr(configHome.about_descripcion),
      about_descripcion2: toStr(configHome.about_descripcion2),
      about_anos: toStr(configHome.about_anos),
      about_imagen: media ?? mediaUrl ?? "",
      cta_titulo: toStr(configHome.cta_titulo),
      cta_descripcion: toStr(configHome.cta_descripcion),
    });

    setImageUrl(mediaUrl);
  }, [configHome]);

  const F = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (url: string | null) => {
    if (!url) {
      setImageUrl(null);
      setFile(null);
      F("about_imagen", "");
      return;
    }

    setImageUrl(url);

    if (!url.startsWith("blob:")) {
      setFile(null);
      F("about_imagen", url);
    }
  };

  const handleUpload = async (selectedFile: File): Promise<string> => {
    setFile(selectedFile);

    const localUrl = URL.createObjectURL(selectedFile);
    setImageUrl(localUrl);
    F("about_imagen", localUrl);

    return localUrl;
  };

  const save = async () => {
    try {
      setSaving(true);

      const payload: ConfigHomePayload = {
        hero_title: form.hero_title,
        hero_subtitle: form.hero_subtitle,
        hero_cta: form.hero_cta,
        services_title: form.services_title,
        projects_title: form.projects_title,
        stats_anos_valor: form.stats_anos_valor,
        stats_proyectos_valor: form.stats_proyectos_valor,
        stats_clientes_valor: form.stats_clientes_valor,
        stats_colaboradores_valor: form.stats_colaboradores_valor,
        about_titulo: form.about_titulo,
        about_descripcion: form.about_descripcion,
        about_descripcion2: form.about_descripcion2,
        about_anos: form.about_anos,
        cta_titulo: form.cta_titulo,
        cta_descripcion: form.cta_descripcion,
      };

      const deletedMediaIds: string[] = [];

      const currentUrl =
        form.about_imagen &&
        typeof form.about_imagen === "object" &&
        "url" in form.about_imagen
          ? form.about_imagen.url
          : typeof form.about_imagen === "string"
            ? form.about_imagen
            : null;

      if (file) {
        const uploaded = await uploadMedia(file, "config_home");
        if (!uploaded) throw new Error("Error subiendo imagen");

        payload.about_imagen = uploaded.id;

        if (initialMediaId) {
          deletedMediaIds.push(initialMediaId);
        }
      } else if (!imageUrl) {
        payload.about_imagen = "";

        if (initialMediaId) {
          deletedMediaIds.push(initialMediaId);
        }
      } else if (!imageUrl.startsWith("blob:")) {
        if (initialMediaId && currentUrl === imageUrl) {
          payload.about_imagen = initialMediaId;
        } else {
          payload.about_imagen = imageUrl;

          if (initialMediaId) {
            deletedMediaIds.push(initialMediaId);
          }
        }
      } else if (initialMediaId) {
        payload.about_imagen = initialMediaId;
      } else {
        payload.about_imagen = "";
      }

      if (deletedMediaIds.length > 0) {
        payload.deletedMediaIds = deletedMediaIds;
      }

      await updateConfigHome(payload, (res) => {
        if (res.success) {
          showMessage("Configuración actualizada correctamente", "success");
          return;
        }

        showMessage(res.message || "Error", "error");
      });
    } catch (error) {
      console.error(error);
      showMessage("Ocurrió un error inesperado", "error");
    } finally {
      setSaving(false);
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
    <>
      <div className="space-y-5">
        <section className="rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="text-base font-extrabold text-primary sm:text-lg">
                Configuración general del Home
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Edita el contenido principal que alimenta la landing.
              </p>
            </div>

            <div className="hidden sm:block">
              <CustomButton
                text={saving ? "Guardando..." : "Guardar cambios"}
                icon={
                  saving ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Save size={16} />
                  )
                }
                onClick={save}
                disabled={saving}
                variant="primary"
                size="md"
                fontSize="14px"
                className="w-full! justify-center gap-2! px-4! sm:w-auto!"
              />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5">
          <section className={sectionCardClass}>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <LayoutPanelTop size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-primary sm:text-lg">
                  Hero
                </h3>
                <p className="text-sm text-muted-foreground">
                  Contenido principal que verá el usuario al entrar.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <CustomInput
                label="Título"
                value={form.hero_title}
                onChange={(e) => F("hero_title", e.target.value)}
                fullWidth
              />

              <CustomInput
                label="Subtítulo"
                value={form.hero_subtitle}
                onChange={(e) => F("hero_subtitle", e.target.value)}
                fullWidth
              />

              <CustomInput
                label="Texto botón"
                value={form.hero_cta}
                onChange={(e) => F("hero_cta", e.target.value)}
                fullWidth
              />
            </div>
          </section>

          <section className={sectionCardClass}>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Type size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-primary sm:text-lg">
                  Secciones
                </h3>
                <p className="text-sm text-muted-foreground">
                  Títulos base de bloques principales.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CustomInput
                label="Servicios"
                value={form.services_title}
                onChange={(e) => F("services_title", e.target.value)}
                fullWidth
              />

              <CustomInput
                label="Proyectos"
                value={form.projects_title}
                onChange={(e) => F("projects_title", e.target.value)}
                fullWidth
              />
            </div>
          </section>

          <section className={sectionCardClass}>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-primary sm:text-lg">
                  Estadísticas
                </h3>
                <p className="text-sm text-muted-foreground">
                  Valores destacados mostrados en la landing.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 xs:grid-cols-2">
              {STAT_FIELDS.map(({ key, label }) => (
                <CustomInput
                  key={key}
                  label={label}
                  value={form[key]}
                  onChange={(e) => F(key, e.target.value)}
                  icon={
                    <Type
                      size={16}
                      style={{ color: "var(--color-text-muted)" }}
                    />
                  }
                  fullWidth
                />
              ))}
            </div>
          </section>

          <section className={sectionCardClass}>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ImageIcon size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-primary sm:text-lg">
                  Quiénes Somos
                </h3>
                <p className="text-sm text-muted-foreground">
                  Información descriptiva e imagen principal de la sección.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <CustomInput
                label="Título"
                value={form.about_titulo}
                onChange={(e) => F("about_titulo", e.target.value)}
                fullWidth
              />

              <CustomInput
                label="Descripción"
                value={form.about_descripcion}
                onChange={(e) => F("about_descripcion", e.target.value)}
                multiline
                rows={4}
                fullWidth
              />

              <CustomInput
                label="Descripción 2"
                value={form.about_descripcion2}
                onChange={(e) => F("about_descripcion2", e.target.value)}
                multiline
                rows={4}
                fullWidth
              />

              <div className="grid grid-cols-1 gap-4 md:max-w-56">
                <CustomInput
                  label="Años"
                  value={form.about_anos}
                  onChange={(e) => F("about_anos", e.target.value)}
                  fullWidth
                />
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-primary">Imagen</p>
                  <p className="text-xs text-muted-foreground">
                    Sube o selecciona la imagen principal de la sección.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-surface-soft p-3 sm:p-4">
                  <CustomImageUploader
                    value={imageUrl}
                    onChange={handleImageChange}
                    onUpload={handleUpload}
                    label="Imagen"
                    onPreview={() => setViewerOpen(true)}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className={sectionCardClass}>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Megaphone size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-primary sm:text-lg">
                  Call To Action
                </h3>
                <p className="text-sm text-muted-foreground">
                  Mensaje final para incentivar contacto o conversión.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <CustomInput
                label="Título"
                value={form.cta_titulo}
                onChange={(e) => F("cta_titulo", e.target.value)}
                fullWidth
              />

              <CustomInput
                label="Descripción"
                value={form.cta_descripcion}
                onChange={(e) => F("cta_descripcion", e.target.value)}
                multiline
                rows={3}
                fullWidth
              />
            </div>
          </section>
        </div>

        <div className="sticky bottom-3 z-10 sm:hidden">
          <div className="rounded-2xl border border-border bg-surface/95 p-3 shadow-lg backdrop-blur">
            <CustomButton
              text={saving ? "Guardando..." : "Guardar cambios"}
              icon={
                saving ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Save size={16} />
                )
              }
              onClick={save}
              disabled={saving}
              variant="primary"
              fontSize="14px"
              className="w-full justify-center px-4! py-3! gap-2!"
            />
          </div>
        </div>
      </div>

      <CustomImageViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        images={
          imageUrl
            ? [
                {
                  src: imageUrl,
                  alt: form.about_titulo || "Imagen",
                },
              ]
            : []
        }
      />
    </>
  );
};

export default ConfigHomeSection;