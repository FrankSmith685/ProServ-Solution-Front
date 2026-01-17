import { useState, type FC } from "react";
import type { PropItem } from "@/interfaces/ui/documents/IDocumentComponents";
import type { BaseVariant } from "@/shared/design/types";

import { DocumentComponent } from "../components/DocumentComponent";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";

import {
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  FONT_FAMILIES,
} from "@/constant/font";
import type { DocumentPasswordState } from "@/interfaces/ui/documents/IDocumentPassword";
import type { InputSize } from "@/interfaces/ui/kit/ICustomInput";

const DocumentPassword: FC = () => {
  const [state, setState] = useState<DocumentPasswordState>({
    label: "Contraseña",
    value: "",
    variant: "primary",
    size: "lg",
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: DEFAULT_FONT_SIZE,
    placeholder: "",
    disabled: false,
    fullWidth: false,
    required: false,
    error: false,
    helperText: "",
  });

  const props: PropItem[] = [
    { name: "label", description: "Texto del label", type: "string", defaultValue: `"Contraseña"` },
    { name: "value", description: "Valor del input", type: "string", defaultValue: `""` },
    { name: "type", description: "Tipo de input", type: `"password"`, defaultValue: `"password"`, required: true },
    { name: "variant", description: "Variante", type: "BaseVariant", defaultValue: `"primary"` },
    { name: "size", description: "Tamaño", type: `"md" | "lg"`, defaultValue: `"lg"` },
    { name: "fontFamily", description: "Fuente del texto", type: "string", defaultValue: `"Arial"` },
    { name: "fontSize", description: "Tamaño del texto", type: "string", defaultValue: `"auto"` },
    { name: "disabled", description: "Deshabilita el input", type: "boolean", defaultValue: "false" },
    { name: "fullWidth", description: "Ocupa el ancho completo", type: "boolean", defaultValue: "false" },
    { name: "required", description: "Marca como requerido", type: "boolean", defaultValue: "false" },
    { name: "error", description: "Estado de error", type: "boolean", defaultValue: "false" },
    { name: "helperText", description: "Texto de ayuda o error", type: "string", defaultValue: `""` },
  ];

  return (
    <DocumentComponent
      name="Password Input"
      description="Campo de contraseña con toggle de visibilidad, variantes de color, tamaños y estados con manejo de errores."
      props={props}
      controls={
        <div className="rounded-2xl border border-white/60 bg-linear-to-br from-white/95 to-primary/5 backdrop-blur shadow-[0_10px_30px_rgba(0,0,0,.06)] p-6">
          <p className="text-xs font-bold text-gray-500 mb-3">Controles</p>

          <div className="flex flex-col gap-4">
            <CustomInput
              label="Label"
              value={state.label}
              onChange={(e) => setState(p => ({ ...p, label: e.target.value }))}
              fullWidth
            />

            <CustomInput
              label="Placeholder"
              value={state.placeholder}
              onChange={(e) => setState(p => ({ ...p, placeholder: e.target.value }))}
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
              label="Tamaño"
              value={state.size}
              onChange={(e) =>
                setState(p => ({ ...p, size: e.target.value as InputSize }))
              }
              options={[
                { value: "md", label: "Medium" },
                { value: "lg", label: "Large" },
              ]}
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

            <CustomInput
              label="Font size (ej: 14px)"
              value={state.fontSize === "default" ? "" : state.fontSize}
              onChange={(e) =>
                setState(p => ({ ...p, fontSize: e.target.value || "default" }))
              }
              placeholder="Default"
              fullWidth
            />

            <CustomSwitch label="Full width" checked={state.fullWidth} onChange={(e) => setState(p => ({ ...p, fullWidth: e.target.checked }))} />
            <CustomSwitch label="Disabled" checked={state.disabled} onChange={(e) => setState(p => ({ ...p, disabled: e.target.checked }))} />
            <CustomSwitch label="Required" checked={state.required} onChange={(e) => setState(p => ({ ...p, required: e.target.checked }))} />
            <CustomSwitch label="Error" checked={state.error} onChange={(e) => setState(p => ({ ...p, error: e.target.checked }))} />

            <CustomInput
              label="Helper text"
              value={state.helperText}
              onChange={(e) => setState(p => ({ ...p, helperText: e.target.value }))}
              fullWidth
            />
          </div>
        </div>
      }
      preview={
        <form onSubmit={(e) => e.preventDefault()}>
          <CustomInput
            type="password"
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
          />
        </form>
      }
    />
  );
};

export default DocumentPassword;
