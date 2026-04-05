import type { FC } from "react";
import { Image as ImageIcon } from "lucide-react";

import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomImageUploader } from "@/components/ui/kit/CustomImageUploader";
import { CustomImageViewer } from "@/components/ui/media/CustomImageViewer";

import type { AdminSiteConfigBrandingSectionProps } from "@/interfaces/page/admin/panel/IAdminSiteConfig";

const AdminSiteConfigBrandingSection: FC<AdminSiteConfigBrandingSectionProps> = ({
  logo,
  favicon,
  isLogoViewerOpen,
  isFaviconViewerOpen,
  onLogoChange,
  onFaviconChange,
  onLogoUpload,
  onFaviconUpload,
  onRemoveLogo,
  onRemoveFavicon,
  onOpenLogoViewer,
  onCloseLogoViewer,
  onOpenFaviconViewer,
  onCloseFaviconViewer,
}) => {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-6 lg:col-span-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ImageIcon size={20} />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-primary sm:text-lg">
              Logo
            </h3>
            <p className="text-sm text-muted-foreground">
              Imagen principal usada en navbar, footer o branding.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <CustomImageUploader
            value={logo?.url ?? null}
            onChange={onLogoChange}
            onUpload={onLogoUpload}
            onPreview={onOpenLogoViewer}
            label="Subir logo"
          />

          {logo && (
            <CustomButton
              text="Quitar logo"
              variant="secondary"
              onClick={onRemoveLogo}
              className="w-full! sm:w-auto!"
            />
          )}

          <CustomImageViewer
            isOpen={isLogoViewerOpen}
            onClose={onCloseLogoViewer}
            images={
              logo
                ? [
                    {
                      src: logo.url,
                      alt: "Logo de la empresa",
                    },
                  ]
                : []
            }
            startIndex={0}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-6 lg:col-span-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ImageIcon size={20} />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-primary sm:text-lg">
              Favicon
            </h3>
            <p className="text-sm text-muted-foreground">
              Ícono pequeño usado en navegador y accesos rápidos.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <CustomImageUploader
            value={favicon?.url ?? null}
            onChange={onFaviconChange}
            onUpload={onFaviconUpload}
            onPreview={onOpenFaviconViewer}
            label="Subir favicon"
          />

          {favicon && (
            <CustomButton
              text="Quitar favicon"
              variant="secondary"
              onClick={onRemoveFavicon}
              className="w-full! sm:w-auto!"
            />
          )}

          <CustomImageViewer
            isOpen={isFaviconViewerOpen}
            onClose={onCloseFaviconViewer}
            images={
              favicon
                ? [
                    {
                      src: favicon.url,
                      alt: "Favicon de la empresa",
                    },
                  ]
                : []
            }
            startIndex={0}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSiteConfigBrandingSection;