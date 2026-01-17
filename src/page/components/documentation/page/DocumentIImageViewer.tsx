import { useState, type FC } from "react";
import type { PropItem } from "@/interfaces/ui/documents/IDocumentComponents";

import { DocumentComponent } from "../components/DocumentComponent";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomImageViewer } from "@/components/ui/media/CustomImageViewer";
import type { CustomImageViewerImage } from "@/interfaces/ui/media/ICustomImageViewer";

const DocumentImageViewer: FC = () => {
  const [open, setOpen] = useState(false);

  const images: CustomImageViewerImage[] = [
    { src: "/images/demo1.jpg", alt: "Primera imagen" },
    { src: "/images/demo2.jpg", alt: "Segunda imagen" },
    { src: "/images/demo3.jpg", alt: "Tercera imagen" },
  ];

  const props: PropItem[] = [
    {
      name: "images",
      description: "Lista de imágenes",
      type: "{ src: string; alt?: string }[]",
      required: true,
    },
    {
      name: "startIndex",
      description: "Imagen inicial",
      type: "number",
      defaultValue: "0",
    },
    {
      name: "isOpen",
      description: "Controla visibilidad",
      type: "boolean",
      defaultValue: "false",
    },
    {
      name: "onClose",
      description: "Cierra visor",
      type: "() => void",
    },
  ];

  return (
    <DocumentComponent
      name="Custom Image Viewer"
      description="Visor de imágenes fullscreen con navegación, animación glass UI y accesibilidad."
      props={props}
      preview={
        <>
          <CustomButton text="Abrir Viewer" onClick={() => setOpen(true)} />
          <CustomImageViewer
            images={images}
            isOpen={open}
            onClose={() => setOpen(false)}
          />
        </>
      }
    />
  );
};

export default DocumentImageViewer;
