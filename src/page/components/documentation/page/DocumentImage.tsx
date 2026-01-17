import { useState, type FC } from "react";
import type { PropItem } from "@/interfaces/ui/documents/IDocumentComponents";

import { DocumentComponent } from "../components/DocumentComponent";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";
import { CustomImage } from "@/components/ui/media/CustomImage";
import type { DocumentCustomImageState } from "@/interfaces/ui/documents/IDocumentCustomImage";
import type { ImageRadius } from "@/interfaces/ui/media/ICustomImage";

const DocumentCustomImage: FC = () => {
  const [state, setState] = useState<DocumentCustomImageState>({
    name: "banner_01",
    width: "400px",
    height: "250px",
    radius: "lg",
    cover: true,
  });

  const props: PropItem[] = [
    { name: "name", description: "Nombre de la imagen registrada", type: "string", defaultValue: `"banner_01"`, required: true },
    { name: "alt", description: "Texto accesible", type: "string", defaultValue: `"image"` },
    { name: "width", description: "Ancho", type: "number | string", defaultValue: `"auto"` },
    { name: "height", description: "Alto", type: "number | string", defaultValue: `"auto"` },
    { name: "radius", description: "Borde redondeado", type: `"none | sm | md | lg | xl | full"`, defaultValue: `"lg"` },
    { name: "cover", description: "Usa object-cover", type: "boolean", defaultValue: "true" },
  ];

  return (
    <DocumentComponent
      name="Custom Image"
      description="Imagen reutilizable con lazy load, blur, spinner, tema UI y configuración estética."
      props={props}
      controls={
        <div className="rounded-2xl border border-white/60 bg-linear-to-br from-white/95 to-primary/5 backdrop-blur p-6 shadow-[0_10px_30px_rgba(0,0,0,.06)]">
          <p className="text-xs font-bold text-gray-500 mb-3">Controles</p>

          <div className="flex flex-col gap-4">
            <CustomInput
              label="Name"
              value={state.name}
              onChange={(e) => setState(p => ({ ...p, name: e.target.value }))}
              fullWidth
            />

            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Width"
                value={state.width}
                onChange={(e) => setState(p => ({ ...p, width: e.target.value }))}
                fullWidth
              />
              <CustomInput
                label="Height"
                value={state.height}
                onChange={(e) => setState(p => ({ ...p, height: e.target.value }))}
                fullWidth
              />
            </div>

            <CustomSelected
              label="Radius"
              value={state.radius}
              onChange={(e) =>
                setState(p => ({ ...p, radius: e.target.value as ImageRadius}))
              }
              options={[
                { value: "none", label: "None" },
                { value: "sm", label: "Small" },
                { value: "md", label: "Medium" },
                { value: "lg", label: "Large" },
                { value: "xl", label: "XL" },
                { value: "full", label: "Full" },
              ]}
              fullWidth
            />

            <CustomSwitch
              label="Cover mode"
              checked={state.cover}
              onChange={(e) =>
                setState(p => ({ ...p, cover: e.target.checked }))
              }
            />
          </div>
        </div>
      }
      preview={
        <CustomImage
          name={state.name}
          alt="demo image"
          width={state.width}
          height={state.height}
          radius={state.radius}
          cover={state.cover}
        />
      }
    />
  );
};

export default DocumentCustomImage;
