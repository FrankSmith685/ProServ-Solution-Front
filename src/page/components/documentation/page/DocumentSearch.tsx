import { useState, type FC } from "react";
import type { BaseVariant } from "@/shared/design/types";
import type { PropItem } from "@/interfaces/ui/documents/IDocumentComponents";

import { DocumentComponent } from "../components/DocumentComponent";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";

import {
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  FONT_FAMILIES,
} from "@/constant/font";

import type { DocumentSearchState } from "@/interfaces/ui/documents/IDocumentSearch";

const DocumentSearch: FC = () => {
  const [state, setState] = useState<DocumentSearchState>({
    label: "Buscar",
    value: "",
    placeholder: "Buscar...",
    variant: "primary",
    size: "lg",
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: DEFAULT_FONT_SIZE,
    disabled: false,
    fullWidth: false,
    error: false,
    helperText: "",
  });

  const props: PropItem[] = [
    { name: "type", description: "Tipo de input", type: `"search"`, defaultValue: `"search"`, required: true },
    { name: "value", description: "Valor del input", type: "string", defaultValue: `""` },
    { name: "placeholder", description: "Texto dentro del input", type: "string", defaultValue: `"Buscar..."` },
    { name: "variant", description: "Variante de color", type: "BaseVariant", defaultValue: `"primary"` },
    { name: "size", description: "Tamaño del input", type: `"sm" | "md" | "lg"`, defaultValue: `"lg"` },
    { name: "fontFamily", description: "Fuente del texto", type: "string", defaultValue: `"Inter"` },
    { name: "fontSize", description: "Tamaño del texto", type: "string", defaultValue: `"auto"` },
    { name: "disabled", description: "Deshabilita el input", type: "boolean", defaultValue: "false" },
    { name: "fullWidth", description: "Ocupa el ancho completo", type: "boolean", defaultValue: "false" },
    { name: "error", description: "Estado de error", type: "boolean", defaultValue: "false" },
    { name: "helperText", description: "Texto de ayuda o error", type: "string", defaultValue: `""` },
  ];

  return (
    <DocumentComponent
      name="Search Input"
      description="Campo de búsqueda moderno con icono implícito, variantes, tamaños y estados de error."
      props={props}
      controls={
        <div
          className="
            rounded-2xl
            border border-border
            bg-surface-glass
            backdrop-blur-xl
            shadow-sm
            p-6
          "
        >
          <p className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
            Controles
          </p>

          <div className="flex flex-col gap-4">

            <CustomInput
              label="Placeholder"
              value={state.placeholder}
              onChange={(e) =>
                setState((p) => ({ ...p, placeholder: e.target.value }))
              }
              fullWidth
            />

            <CustomSelected
              label="Variante"
              value={state.variant}
              onChange={(e) =>
                setState((p) => ({
                  ...p,
                  variant: e.target.value as BaseVariant,
                }))
              }
              options={[
                { value: "primary", label: "Primary" },
                { value: "secondary", label: "Secondary" },
                { value: "terciary", label: "Terciary" },
                { value: "warning", label: "Warning" },
                { value: "error", label: "Error" },
              ]}
              fullWidth
            />

            <CustomSelected
              label="Tamaño"
              value={state.size}
              onChange={(e) =>
                setState((p) => ({
                  ...p,
                  size: e.target.value as "sm" | "md" | "lg",
                }))
              }
              options={[
                { value: "sm", label: "Small" },
                { value: "md", label: "Medium" },
                { value: "lg", label: "Large" },
              ]}
              fullWidth
            />

            <CustomInput
              label="Font size (ej: 14px)"
              value={state.fontSize === "default" ? "" : state.fontSize}
              onChange={(e) =>
                setState((p) => ({
                  ...p,
                  fontSize: e.target.value || "default",
                }))
              }
              placeholder="Default"
              fullWidth
            />

            <CustomSelected
              label="Font family"
              value={state.fontFamily}
              onChange={(e) =>
                setState((p) => ({
                  ...p,
                  fontFamily: String(e.target.value),
                }))
              }
              options={FONT_FAMILIES}
              fullWidth
            />

            <CustomSwitch
              label="Full width"
              checked={state.fullWidth}
              onChange={(e) =>
                setState((p) => ({
                  ...p,
                  fullWidth: e.target.checked,
                }))
              }
            />

            <CustomSwitch
              label="Disabled"
              checked={state.disabled}
              onChange={(e) =>
                setState((p) => ({
                  ...p,
                  disabled: e.target.checked,
                }))
              }
            />

            <CustomSwitch
              label="Error"
              checked={state.error}
              onChange={(e) =>
                setState((p) => ({ ...p, error: e.target.checked }))
              }
            />

            <CustomInput
              label="Helper text"
              value={state.helperText}
              onChange={(e) =>
                setState((p) => ({
                  ...p,
                  helperText: e.target.value,
                }))
              }
              fullWidth
            />
          </div>
        </div>
      }
      preview={
        <div className="flex items-center justify-center p-6 w-full">
          <div className="w-full max-w-xl">
            <CustomInput
              type="search"
              value={state.value}
              onChange={(e) =>
                setState((p) => ({ ...p, value: e.target.value }))
              }
              placeholder={state.placeholder}
              variant={state.variant}
              size={state.size}
              fontSize={
                state.fontSize === "default" ? undefined : state.fontSize
              }
              fontFamily={state.fontFamily}
              disabled={state.disabled}
              fullWidth={state.fullWidth}
              error={state.error}
              helperText={
                state.error
                  ? state.helperText || "Búsqueda inválida"
                  : state.helperText
              }
            />
          </div>
        </div>
      }
    />
  );
};

export default DocumentSearch;