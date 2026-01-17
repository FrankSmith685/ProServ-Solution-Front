import { useState, type FC } from "react";
import type { PropItem } from "@/interfaces/ui/documents/IDocumentComponents";

import { DocumentComponent } from "../components/DocumentComponent";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";
import { CustomLink } from "@/components/ui/kit/CustomLink";

import { FiExternalLink } from "react-icons/fi";
import type { DocumentLinkState } from "@/interfaces/ui/documents/IDocumentLink";
import type { BaseVariant } from "@/shared/design/types";
import type { LinkUnderline } from "@/interfaces/ui/kit/ICustomLink";

const DocumentLink: FC = () => {
  const [state, setState] = useState<DocumentLinkState>({
    text: "Ver más",
    variant: "primary",
    underline: "hover",
    withIcon: false,
  });

  const props: PropItem[] = [
    { name: "text", description: "Texto del enlace", type: "string", required: true },
    { name: "variant", description: "Variante visual", type: "BaseVariant", defaultValue: `"primary"` },
    { name: "to", description: "Ruta interna (React Router)", type: "string" },
    { name: "href", description: "URL externa", type: "string" },
    { name: "underline", description: "Estilo del subrayado", type: `"always" | "hover" | "none"`, defaultValue: `"hover"` },
    { name: "icon", description: "Ícono opcional al lado del texto", type: "ReactNode" },
  ];

  return (
    <DocumentComponent
      name="Link Personalizado"
      description="Enlace reutilizable con variantes de color, soporte para rutas internas/externas y subrayado controlado."
      props={props}
      controls={
        <div className="
          rounded-2xl
          border border-white/60
          bg-linear-to-br from-white/95 to-primary/5
          backdrop-blur
          shadow-[0_10px_30px_rgba(0,0,0,.06)]
          p-6
        ">
          <p className="text-xs font-bold text-gray-500 mb-3">
            Controles
          </p>

          <div className="flex flex-col gap-4">
            <CustomInput
              label="Texto"
              value={state.text}
              onChange={(e) =>
                setState(p => ({ ...p, text: e.target.value }))
              }
              fullWidth
            />

            <CustomSelected
              label="Variante"
              value={state.variant}
              onChange={(e) =>
                setState(p => ({ ...p, variant: e.target.value as BaseVariant }))
              }
              options={[
                { value: "primary", label: "Primary" },
                { value: "secondary", label: "Secondary" },
                { value: "terciary", label: "Terciary" },
                { value: "warning", label: "Warning" },
              ]}
              fullWidth
            />

            <CustomSelected
              label="Underline"
              value={state.underline}
              onChange={(e) =>
                setState(p => ({ ...p, underline: e.target.value as LinkUnderline }))
              }
              options={[
                { value: "always", label: "Always" },
                { value: "hover", label: "Hover" },
                { value: "none", label: "None" },
              ]}
              fullWidth
            />

            <CustomSwitch
              label="Ícono"
              checked={state.withIcon}
              onChange={(e) =>
                setState(p => ({ ...p, withIcon: e.target.checked }))
              }
            />
          </div>
        </div>
      }
      preview={
        <CustomLink
          text={state.text}
          variant={state.variant}
          underline={state.underline}
          href="#"
          icon={state.withIcon ? <FiExternalLink size={14} /> : undefined}
        />
      }
    />
  );
};

export default DocumentLink;
