import type { FC } from "react";
import { BookOpen, Image as ImageIcon } from "lucide-react";

import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomImageUploader } from "@/components/ui/kit/CustomImageUploader";
import { CustomImageViewer } from "@/components/ui/media/CustomImageViewer";

import type { NosotrosHistoriaSectionProps } from "@/interfaces/layouts/admin/panel/nosotros/INosotrosHistoriaSection";

const NosotrosHistoriaSection: FC<NosotrosHistoriaSectionProps> = ({
  form,
  imageUrl,
  isHistoryViewerOpen,
  onTextChange,
  onImageChange,
  onImageUpload,
  onOpenViewer,
  onCloseViewer,
}) => {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-6 lg:col-span-7">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BookOpen size={20} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-primary sm:text-lg">
              Historia de la empresa
            </h3>
            <p className="text-sm text-muted-foreground">
              Configura el bloque principal informativo.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <CustomInput
            label="Título principal"
            value={form.historia_titulo}
            onChange={onTextChange("historia_titulo")}
            placeholder="Ej. Nuestra historia"
            fullWidth
          />

          <CustomInput
            label="Párrafo 1"
            value={form.historia_p1}
            onChange={onTextChange("historia_p1")}
            placeholder="Describe los inicios de la empresa..."
            multiline
            rows={4}
            fullWidth
          />

          <CustomInput
            label="Párrafo 2"
            value={form.historia_p2}
            onChange={onTextChange("historia_p2")}
            placeholder="Explica la evolución o experiencia..."
            multiline
            rows={4}
            fullWidth
          />

          <CustomInput
            label="Párrafo 3 / ubicación"
            value={form.historia_p3}
            onChange={onTextChange("historia_p3")}
            placeholder="Información complementaria, ubicación o cierre..."
            multiline
            rows={3}
            fullWidth
          />
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-6 lg:col-span-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ImageIcon size={20} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-primary sm:text-lg">
              Imagen de historia
            </h3>
            <p className="text-sm text-muted-foreground">
              Sube o reemplaza la imagen principal de esta sección.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <CustomImageUploader
            label="Subir imagen"
            value={imageUrl}
            onChange={onImageChange}
            onUpload={onImageUpload}
            onPreview={onOpenViewer}
          />

          <CustomImageViewer
            images={
              imageUrl
                ? [
                    {
                      src: imageUrl,
                      alt: "Imagen de historia",
                    },
                  ]
                : []
            }
            isOpen={isHistoryViewerOpen}
            onClose={onCloseViewer}
            startIndex={0}
          />
        </div>
      </div>
    </div>
  );
};

export default NosotrosHistoriaSection;