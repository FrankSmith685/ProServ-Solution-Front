import { useState, type FC } from "react";
import { DocumentComponent } from "../components/DocumentComponent";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";

import type { PropItem } from "@/interfaces/ui/documents/IDocumentComponents";

import {
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  FONT_FAMILIES,
} from "@/constant/font";

import { TfiEmail } from "react-icons/tfi";
import type { DocumentInputState } from "@/interfaces/ui/documents/IDocumentInput";
import type { BaseVariant } from "@/shared/design/types";
import type { CustomInputType, InputSize } from "@/interfaces/ui/kit/ICustomInput";

const DocumentInput: FC = () => {
  const [state, setState] = useState<DocumentInputState>({
    variant: "primary",
    value: "",
    label: "Campo de texto",
    disabled: false,
    size: "lg",
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: DEFAULT_FONT_SIZE,
    fullWidth: false,
    placeholder: "",
    required: false,
    error: false,
    helperText: "",
    multiline: false,
    rows: 3,
    type: "text",
    withIcon: false,
  });

  const props: PropItem[] = [
    { name: "label", description: "Texto del label", type: "string", defaultValue: `"Campo de texto"` },
    { name: "value", description: "Valor del input", type: "string", defaultValue: `""` },
    { name: "variant", description: "Variante de color", type: "BaseVariant", defaultValue: `"primary"` },
    { name: "size", description: "Tamaño", type: `"md" | "lg"`, defaultValue: `"lg"` },
    { name: "fontFamily", description: "Fuente", type: "string", defaultValue: `"Arial"` },
    { name: "fontSize", description: "Tamaño del texto", type: "string", defaultValue: `"auto"` },
    { name: "disabled", description: "Deshabilita el componente", type: "boolean", defaultValue: "false" },
    { name: "fullWidth", description: "Ocupar ancho completo", type: "boolean", defaultValue: "false" },
    { name: "required", description: "Campo requerido", type: "boolean", defaultValue: "false" },
    { name: "error", description: "Estado de error", type: "boolean", defaultValue: "false" },
    { name: "helperText", description: "Texto de ayuda", type: "string", defaultValue: `""` },
    { name: "multiline", description: "Habilitar textarea", type: "boolean", defaultValue: "false" },
    { name: "rows", description: "Número de filas", type: "number", defaultValue: "3" },
    { name: "type", description: "Tipo de input", type: `"text" | "number"`, defaultValue: `"text"` },
    { name: "icon", description: "Ícono opcional", type: "ReactNode" },
  ];

  return (
    <DocumentComponent
      name="Input Personalizado"
      description="Input estilizado con variantes, tamaños, tipografía, estados, multiline y soporte de ícono."
      props={props}
      controls={
        <div className="rounded-2xl border border-white/60 bg-linear-to-br from-white/95 to-primary/5 backdrop-blur shadow-[0_10px_30px_rgba(0,0,0,.06)] p-6">
          <p className="text-xs font-bold text-gray-500 mb-3">Controles</p>

          <div className="flex flex-col gap-4">
            <CustomInput
              label="Texto del label"
              value={state.label}
              onChange={(e) => setState(p => ({ ...p, label: e.target.value }))}
              fullWidth
            />

            <CustomSelected
              label="Variante"
              value={state.variant}
              onChange={(e) => setState(p => ({ ...p, variant: e.target.value as BaseVariant }))}
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
              onChange={(e) => setState(p => ({ ...p, size: e.target.value as InputSize }))}
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
                setState(p => ({ ...p, fontSize: e.target.value || "default" }))
              }
              placeholder="Default"
              fullWidth
            />

            <CustomSelected
              label="Font family"
              value={state.fontFamily}
              onChange={(e) =>
                setState(p => ({ ...p, fontFamily: String(e.target.value) }))
              }
              options={FONT_FAMILIES}
              fullWidth
            />

            <CustomSwitch label="Full width" checked={state.fullWidth} onChange={(e) => setState(p => ({ ...p, fullWidth: e.target.checked }))} />
            <CustomSwitch label="Disabled" checked={state.disabled} onChange={(e) => setState(p => ({ ...p, disabled: e.target.checked }))} />

            <CustomInput label="Placeholder" value={state.placeholder} onChange={(e) => setState(p => ({ ...p, placeholder: e.target.value }))} />

            <CustomInput label="Helper text" value={state.helperText} onChange={(e) => setState(p => ({ ...p, helperText: e.target.value }))} />

            <CustomSelected
              label="Type"
              value={state.type}
              onChange={(e) =>
                setState(p => ({ ...p, type: e.target.value as CustomInputType }))
              }
              options={[
                { value: "text", label: "Text" },
                { value: "number", label: "Number" },
              ]}
              fullWidth
            />

            <CustomSwitch label="Required" checked={state.required} onChange={(e) => setState(p => ({ ...p, required: e.target.checked }))} />
            <CustomSwitch label="Error" checked={state.error} onChange={(e) => setState(p => ({ ...p, error: e.target.checked }))} />
            <CustomSwitch label="Multiline" checked={state.multiline} onChange={(e) => setState(p => ({ ...p, multiline: e.target.checked }))} />

            {state.multiline && (
              <CustomInput
                label="Rows"
                type="number"
                value={String(state.rows)}
                onChange={(e) => setState(p => ({ ...p, rows: Number(e.target.value) }))}
              />
            )}

            <CustomSwitch
              label="Ícono"
              checked={state.withIcon}
              onChange={(e) => setState(p => ({ ...p, withIcon: e.target.checked }))}
            />
          </div>
        </div>
      }
      preview={
        <CustomInput
          label={state.label}
          value={state.value}
          onChange={(e) => setState(p => ({ ...p, value: e.target.value }))}
          placeholder={state.placeholder}
          variant={state.variant}
          size={state.size}
          fontSize={state.fontSize === "default" ? undefined : state.fontSize}
          fontFamily={state.fontFamily}
          disabled={state.disabled}
          fullWidth={state.fullWidth}
          required={state.required}
          error={state.error}
          helperText={state.error ? state.helperText || " " : state.helperText}
          multiline={state.multiline}
          rows={state.multiline ? state.rows : undefined}
          type={state.type}
          icon={state.withIcon ? <TfiEmail size={16} /> : undefined}
        />
      }
    />
  );
};

export default DocumentInput;
