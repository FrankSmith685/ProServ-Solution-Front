import { useState, type FC } from "react";
import type { PropItem } from "@/interfaces/ui/documents/IDocumentComponents";

import { DocumentComponent } from "../components/DocumentComponent";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";
import { CustomCard } from "@/components/ui/kit/CustomCard";

import { FiSettings } from "react-icons/fi";
import type { DocumentCardState } from "@/interfaces/ui/documents/IDocumentCard";
import type { Variant } from "@/shared/design/types";

const DocumentCard: FC = () => {
  const [state, setState] = useState<DocumentCardState>({
    title: "Título del Card",
    description: "Descripción del contenido del card",
    variant: "terciary",
    hoverable: false,
    fullWidth: false,
    withHeaderExtra: false,
  });

  const props: PropItem[] = [
    { name: "title", description: "Título del card", type: "string", defaultValue: `"Título del Card"` },
    { name: "description", description: "Descripción del card", type: "string", defaultValue: `"Descripción del contenido del card"` },
    { name: "variant", description: "Variante visual", type: "Variant", defaultValue: `"terciary"` },
    { name: "hoverable", description: "Activa animación hover", type: "boolean", defaultValue: "false" },
    { name: "fullWidth", description: "Ocupa todo el ancho disponible", type: "boolean", defaultValue: "false" },
    {
      name: "headerExtra",
      description: "Elemento adicional en el header",
      type: "ReactNode",
      defaultValue: "undefined",
      notes: "Ej: icono, botón o badge",
    },
    { name: "children", description: "Contenido interno del card", type: "ReactNode" },
  ];

  return (
    <DocumentComponent
      name="Card Personalizado"
      description="Card reutilizable con variantes, hover, ancho completo y header opcional."
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
              label="Título"
              value={state.title}
              onChange={(e) => setState(p => ({ ...p, title: e.target.value }))}
              fullWidth
            />

            <CustomInput
              label="Descripción"
              value={state.description}
              onChange={(e) => setState(p => ({ ...p, description: e.target.value }))}
              fullWidth
            />

            <CustomSelected
              label="Variante"
              value={state.variant}
              onChange={(e) => setState(p => ({ ...p, variant: e.target.value as Variant }))}
              options={[
                { value: "primary", label: "Primary" },
                { value: "secondary", label: "Secondary" },
                { value: "terciary", label: "Terciary" },
                { value: "warning", label: "Warning" },
                { value: "primary-outline", label: "Primary outline" },
                { value: "secondary-outline", label: "Secondary outline" },
                { value: "terciary-outline", label: "Terciary outline" },
                { value: "warning-outline", label: "Warning outline" },
              ]}
              fullWidth
            />

            <CustomSwitch
              label="Hoverable"
              checked={state.hoverable}
              onChange={(e) =>
                setState(p => ({ ...p, hoverable: e.target.checked }))
              }
            />

            <CustomSwitch
              label="Full width"
              checked={state.fullWidth}
              onChange={(e) =>
                setState(p => ({ ...p, fullWidth: e.target.checked }))
              }
            />

            <CustomSwitch
              label="Header extra"
              checked={state.withHeaderExtra}
              onChange={(e) =>
                setState(p => ({ ...p, withHeaderExtra: e.target.checked }))
              }
            />
          </div>
        </div>
      }
      preview={
        <CustomCard
          title={state.title}
          description={state.description}
          variant={state.variant}
          hoverable={state.hoverable}
          fullWidth={state.fullWidth}
          headerExtra={state.withHeaderExtra ? <FiSettings size={18} /> : undefined}
        >
          <p className="text-sm text-gray-600">
            Contenido interno del card (children)
          </p>
        </CustomCard>
      }
    />
  );
};

export default DocumentCard;
