import { useState, type FC } from "react";
import { DocumentComponent } from "../components/DocumentComponent";
import type { BaseVariant } from "@/shared/design/types";
import type { PropItem } from "@/interfaces/ui/documents/IDocumentComponents";

import {
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  FONT_FAMILIES
} from "@/constant/font";

import { CustomSelected } from "@/components/ui/kit/CustomSelected";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";
import type { DocumentSelectedState } from "@/interfaces/ui/documents/IDocumentSelected";

const OPTIONS = [
  { value: "option1", label: "Opción 1" },
  { value: "option2", label: "Opción 2" },
  { value: "option3", label: "Opción 3" },
];

const DocumentSelected: FC = () => {
  const [state, setState] = useState<DocumentSelectedState>({
    variant: "primary",
    value: "",
    label: "Seleccione una opción",
    disabled: false,
    size: "lg",
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: DEFAULT_FONT_SIZE,
    fullWidth: false,
  });

  const props: PropItem[] = [
    { name: "label", description: "Texto del label", type: "string", defaultValue: `"Seleccione una opción"` },
    { name: "value", description: "Valor seleccionado", type: "string", defaultValue: `""` },
    { name: "options", description: "Opciones disponibles", type: "CustomSelectOption[]", required: true },
    { name: "variant", description: "Variante de color", type: "BaseVariant", defaultValue: `"primary"` },
    { name: "size", description: "Tamaño", type: `"md" | "lg"`, defaultValue: `"lg"` },
    { name: "fontFamily", description: "Fuente", type: "string", defaultValue: `"Arial"` },
    { name: "fontSize", description: "Tamaño de fuente", type: "string", defaultValue: `"auto"` },
    { name: "disabled", description: "Deshabilita", type: "boolean", defaultValue: "false" },
    { name: "fullWidth", description: "Ocupar ancho completo", type: "boolean", defaultValue: "false" },
  ];

  return (
    <DocumentComponent
      name="Select Personalizado"
      description="Select estilizado con variantes, tamaños, tipografía y soporte full width."
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
              label="Texto del label"
              value={state.label}
              onChange={(e) =>
                setState(p => ({ ...p, label: e.target.value }))
              }
              fullWidth
            />

            <CustomSelected
              label="Variante"
              value={state.variant}
              onChange={(e) =>
                setState(p => ({
                  ...p,
                  variant: e.target.value as BaseVariant
                }))
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
              label="Tamaño"
              value={state.size}
              onChange={(e) =>
                setState(p => ({
                  ...p,
                  size: e.target.value as "md" | "lg"
                }))
              }
              options={[
                { value: "md", label: "Medium" },
                { value: "lg", label: "Large" },
              ]}
              fullWidth
            />

            <CustomInput
              label="Font size (ej: 14px)"
              value={state.fontSize === "default" ? "" : state.fontSize}
              onChange={(e) =>
                setState(p => ({
                  ...p,
                  fontSize: e.target.value || "default"
                }))
              }
              placeholder="Default"
              fullWidth
            />

            <CustomSelected
              label="Font family"
              value={state.fontFamily}
              onChange={(e) =>
                setState(p => ({
                  ...p,
                  fontFamily: String(e.target.value)
                }))
              }
              options={FONT_FAMILIES}
              fullWidth
            />

            <CustomSelected
              label="Valor"
              value={state.value}
              onChange={(e) =>
                setState(p => ({
                  ...p,
                  value: String(e.target.value)
                }))
              }
              options={OPTIONS}
              fullWidth
            />

            <CustomSwitch
              label="Full width"
              checked={state.fullWidth}
              onChange={(e) =>
                setState(p => ({ ...p, fullWidth: e.target.checked }))
              }
            />

            <CustomSwitch
              label="Disabled"
              checked={state.disabled}
              onChange={(e) =>
                setState(p => ({ ...p, disabled: e.target.checked }))
              }
            />
          </div>
        </div>
      }
      preview={
        <CustomSelected
          label={state.label}
          value={state.value}
          onChange={(e) =>
            setState(p => ({ ...p, value: String(e.target.value) }))
          }
          options={OPTIONS}
          variant={state.variant}
          size={state.size}
          fontSize={state.fontSize === "default" ? undefined : state.fontSize}
          fontFamily={state.fontFamily}
          disabled={state.disabled}
          fullWidth={state.fullWidth}
        />
      }
    />
  );
};

export default DocumentSelected;
