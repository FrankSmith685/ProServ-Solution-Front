import { useState, type FC } from "react";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { DocumentComponent } from "../components/DocumentComponent";

import type { BaseVariant } from "@/shared/design/types";
import type { PropItem } from "@/interfaces/ui/documents/IDocumentComponents";

import {
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  FONT_FAMILIES,
} from "@/constant/font";
import type { DocumentSwitchState } from "@/interfaces/ui/documents/IDocumentSwitch";

const DocumentSwitch: FC = () => {
  const [state, setState] = useState<DocumentSwitchState>({
    variant: "primary",
    label: "Activar notificaciones",
    checked: false,
    disabled: false,
    size: "lg",
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: DEFAULT_FONT_SIZE,
  });

  const props: PropItem[] = [
    { name: "label", description: "Texto del interruptor", type: "string", defaultValue: `"Activar notificaciones"` },
    { name: "checked", description: "Estado del switch", type: "boolean", defaultValue: "false" },
    { name: "variant", description: "Variante de color", type: "BaseVariant", defaultValue: `"primary"` },
    { name: "size", description: "Tamaño del switch", type: ` "sm" | "md" | "lg"`, defaultValue: `"lg"` },
    { name: "fontSize", description: "Tamaño del texto", type: "string", defaultValue: `"auto"` },
    { name: "fontFamily", description: "Fuente del label", type: "string", defaultValue: `"Arial"` },
    { name: "disabled", description: "Deshabilitar componente", type: "boolean", defaultValue: "false" },
  ];

  return (
    <DocumentComponent
      name="Switch Personalizado"
      description="Interruptor estilizado con variantes, tamaños y opciones avanzadas."
      props={props}
      controls={
        <div
          className="
          rounded-2xl
          border border-white/60
          bg-linear-to-br from-white/95 to-primary/5
          backdrop-blur
          shadow-[0_10px_30px_rgba(0,0,0,.06)]
          p-6
        ">
          <p className="text-xs font-bold text-gray-500 mb-3">Controles</p>

          <div className="flex flex-col gap-4">

            <CustomSelected
              label="Variante"
              value={state.variant}
              onChange={(e) =>
                setState(p => ({
                  ...p,
                  variant: e.target.value as BaseVariant,
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
              label="Texto del label"
              value={state.label}
              onChange={(e) =>
                setState(p => ({ ...p, label: e.target.value }))
              }
              fullWidth
            />

            <CustomInput
              label="Font size (ej: 14px)"
              value={state.fontSize === "default" ? "" : state.fontSize}
              onChange={(e) =>
                setState(p => ({
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
                setState(p => ({
                  ...p,
                  fontFamily: String(e.target.value),
                }))
              }
              options={FONT_FAMILIES}
              fullWidth
            />

            <CustomSwitch
              label="Checked"
              checked={state.checked}
              onChange={(e) =>
                setState(p => ({ ...p, checked: e.target.checked }))
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
        <CustomSwitch
          label={state.label}
          checked={state.checked}
          onChange={(e) =>
            setState(p => ({ ...p, checked: e.target.checked }))
          }
          variant={state.variant}
          size={state.size}
          fontSize={state.fontSize === "default" ? undefined : state.fontSize}
          fontFamily={state.fontFamily === "default" ? undefined : state.fontFamily}
          disabled={state.disabled}
        />
      }
    />
  );
};

export default DocumentSwitch;
